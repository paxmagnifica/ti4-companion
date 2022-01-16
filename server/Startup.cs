using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using server.Persistence;
using server.Infra;
using server.Domain;
using System;
using System.Reflection;
using System.Linq;
using Newtonsoft.Json;

namespace server
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSignalR();

            services.AddCors(options =>
            {
                options.AddPolicy(name: "_localhostCors", builder =>
                {
                    builder
                        .WithOrigins(JsonConvert.DeserializeObject<string[]>(Configuration.GetValue<string>("AllowedOrigins")))
                        .AllowAnyHeader()
                        .AllowCredentials();
                });
            });

            services.AddScoped<IRepository, Repository>();

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "server", Version = "v1" });
            });

            services.AddDbContext<SessionContext>(options =>
                options.UseNpgsql(Configuration.GetConnectionString("SessionContext")));

            services.AddScoped<EventFactory>();
            services.AddScoped<SessionHub>();
            services.AddScoped<ITimeProvider, TimeProvider>();
            services.AddScoped<Dispatcher>();
            services.AddScoped<HeaderAuthorization>();
            services.AddScoped<Authorization>();

            AddAllHandlers(services);
        }

        private void AddAllHandlers(IServiceCollection services)
        {
            Type handler = typeof(IHandler);
            Type[] concreteTypes = Assembly.GetExecutingAssembly().GetTypes()
                .Where(t => t.IsClass && t.GetInterfaces().Contains(handler))
                .ToArray();
            foreach (Type t in concreteTypes)
            {
                services.AddScoped(t);
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(
            IApplicationBuilder app,
            IWebHostEnvironment env,
            HeaderAuthorization headerAuthorization
        )
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "server v1"));
            }

            if (!env.IsDevelopment())
            {
                app.UseHttpsRedirection();
            }

            app.UseRouting();

            app.UseCors("_localhostCors");

            headerAuthorization.Setup(app);
            app.UseMiddleware<PreventLockedSessionEditMiddleware>();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<SessionHub>("/sessionHub");
            });
        }
    }
}
