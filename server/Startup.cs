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
using System.Text.RegularExpressions;
using Microsoft.Extensions.Logging;

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
            ILogger<Startup> logger
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

            app.Use(async (context, next) =>
            {
                var protect = context.Request.Method == "POST" && context.Request.Path.ToString().StartsWith("/api/sessions/") && !context.Request.Path.ToString().EndsWith("/edit");
                context.Items.Add("Protect", protect);
                logger.LogDebug($"protecting {context.Request.Path.ToString()}");

                await next.Invoke();
            });
            app.Use(async (context, next) =>
            {
                if (MiddlewareHelpers.IsProtected(context))
                {
                    var secretIsGuid = Guid.TryParse(context.Request.Headers["x-ti4companion-session-secret"], out var sessionSecretGuid);
                    if (secretIsGuid)
                    {
                        context.Items.Add("SessionSecret", sessionSecretGuid);
                        logger.LogDebug($"adding SessionSecret item {sessionSecretGuid}");
                    }

                    var pattern = @"^\/api\/sessions\/(.*?)(\/.*)?$";
                    var sessionId = Regex.Matches(context.Request.Path.ToString(), pattern)[0].Groups[1].Value;
                    if (sessionId != null)
                    {
                        context.Items.Add("SessionId", Guid.Parse(sessionId));
                        logger.LogDebug($"adding SessionId item {sessionId}");
                    }
                }
                await next.Invoke();
            });
            app.UseMiddleware<HeaderAuthorizationMiddleware>();
            // TODO fix and reenable
            // app.UseMiddleware<PreventLockedSessionEditMiddleware>();
            app.UseRouting();

            app.UseCors("_localhostCors");

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<SessionHub>("/sessionHub");
            });
        }
    }
}
