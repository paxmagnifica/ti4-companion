using System;
using System.Net;
using Microsoft.AspNetCore.Builder;

namespace server.Infra
{
    public class HeaderAuthorization
    {
        public void Setup(IApplicationBuilder app)
        {
            app.UseWhen(MiddlewareHelpers.SessionIdInRoute, AddSessionSecretToItems);
            app.UseWhen(MiddlewareHelpers.SessionStateChangingRequests, AllowOnlyWithSecret);
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
