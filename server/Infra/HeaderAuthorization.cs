using System;
using System.Net;
using System.Net.Http;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace server.Infra
{
    public class HeaderAuthorization
    {
        public void Setup(IApplicationBuilder app)
        {
            app.UseWhen(SessionIdInRoute, AddSessionSecretToItems);
            app.UseWhen(SessionStateChangingRequests, AllowOnlyWithSecret);
        }

        private bool SessionStateChangingRequests(HttpContext context)
        {
            return context.Request.Method == HttpMethod.Post.ToString() && SessionIdInRoute(context);
        }

        private bool SessionIdInRoute(HttpContext context)
        {
            return context.Request.RouteValues.ContainsKey("sessionId");
        }

        private void AddSessionSecretToItems(IApplicationBuilder app)
        {
            app.Use(async (context, next) => {
                var secretIsGuid = Guid.TryParse(context.Request.Headers["x-ti4companion-session-secret"], out var sessionSecretGuid);
                if (secretIsGuid)
                {
                    context.Items.Add("SessionSecret", sessionSecretGuid);
                }

                await next();
            });
        }

        private void AllowOnlyWithSecret(IApplicationBuilder app)
        {
            app.Use(async (context, next) => {
                if(!context.Request.Headers.ContainsKey("x-ti4companion-session-secret"))
                {
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    await context.Response.CompleteAsync();

                    return;
                }

                await next();
            });
        }
    }
}
