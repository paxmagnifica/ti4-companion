using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace server.Infra
{
    public class HeaderAuthorizationMiddleware
    {
        private readonly RequestDelegate _next;

        public HeaderAuthorizationMiddleware(RequestDelegate next)
        {
            this._next = next;
        }

        public async Task Invoke(HttpContext httpContext, Authorization authorization, ILogger<HeaderAuthorizationMiddleware> logger)
        {
            if (MiddlewareHelpers.IsProtected(httpContext))
            {
                var sessionId = (Guid)httpContext.Items["SessionId"];
                var sessionSecret = (Guid)httpContext.Items["SessionSecret"];
                logger.LogTrace($"validating token {sessionSecret} for session {sessionId}");
                var tokenValid = await authorization.ValidateToken(sessionId, sessionSecret);


                if (!tokenValid)
                {
                    httpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    await httpContext.Response.CompleteAsync();

                    return;
                }
            }

            await _next(httpContext);
        }
    }
}
