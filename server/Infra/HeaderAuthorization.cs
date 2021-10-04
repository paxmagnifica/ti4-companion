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
            app.UseWhen(this.SessionStateChangingRequests, this.AllowOnlyWithSecret);
        }

        private bool SessionStateChangingRequests(HttpContext context)
        {
            return context.Request.Method == HttpMethod.Post.ToString() &&
                context.Request.RouteValues.ContainsKey("sessionId");
        }

        private void AllowOnlyWithSecret(IApplicationBuilder app)
        {
            app.Use(async (context, next) => {
                if(!context.Request.Headers.ContainsKey("ti4CompanionSecret")) {
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    await context.Response.CompleteAsync();

                    return;
                }

                await next();
            });
        }
    }
}
