using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Server.Domain;
using Server.Infra;
using Server.Persistence;
using System;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;

namespace Server
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            this.Configuration = configuration;

            JsonConvert.DefaultSettings = () => new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver(),
            };
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
                        .WithOrigins(JsonConvert.DeserializeObject<string[]>(this.Configuration.GetValue<string>("AllowedOrigins")))
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
                options.UseNpgsql(this.Configuration.GetConnectionString("SessionContext")));

            services.AddScoped<EventFactory>();
            services.AddScoped<SessionHub>();
            services.AddScoped<ITimeProvider, TimeProvider>();
            services.AddScoped<Dispatcher>();
            services.AddScoped<Authorization>();

            this.AddAllHandlers(services);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(
            IApplicationBuilder app,
            IWebHostEnvironment env,
            ILogger<Startup> logger)
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
                context.Items.Add("ListIdentifier", context.Request.Headers["x-ti4companion-list-identifier"].ToString());

                if (context.Request.Headers.ContainsKey("x-ti4companion-game-version"))
                {
                    context.Items.Add("GameVersion", (GameVersion)Enum.Parse(typeof(GameVersion), context.Request.Headers["x-ti4companion-game-version"].ToString()));
                }
                else
                {
                    // WARNING if you're changing this default version, change the default in /client/src/GameComponents/GameVersionPicker.js
                    context.Items.Add("GameVersion", GameVersion.PoK_Codex2);
                }

                await next.Invoke();
            });

            app.Use(async (context, next) =>
            {
                var protect = context.Request.Method == "POST" && context.Request.Path.ToString().StartsWith("/api/sessions/") && !context.Request.Path.ToString().EndsWith("/edit");
                context.Items.Add("Protect", protect);
                if (protect)
                {
                    logger.LogDebug($"protecting {context.Request.Path.ToString()}");
                }

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
            app.UseCors("_localhostCors");

            app.UseMiddleware<HeaderAuthorizationMiddleware>();

            // TODO fix and reenable
            // app.UseMiddleware<PreventLockedSessionEditMiddleware>();
            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<SessionHub>("/sessionHub");
            });
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
    }
}
