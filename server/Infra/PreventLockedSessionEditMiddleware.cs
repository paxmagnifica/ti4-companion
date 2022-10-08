//

using Microsoft.AspNetCore.Http;
using server.Domain;
using System;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Server.Infra
{
    public class PreventLockedSessionEditMiddleware
    {
        private readonly RequestDelegate next;

        public PreventLockedSessionEditMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task Invoke(HttpContext httpContext, IRepository repository)
        {
            if (MiddlewareHelpers.SessionStateChangingRequests(httpContext) && !(await this.SpecialCaseForUnlockingAsync(httpContext)))
            {
                var sessionIdIsGuid = Guid.TryParse(httpContext.Request.RouteValues["sessionId"].ToString(), out var sessionId);
                if (!sessionIdIsGuid)
                {
                    httpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    await httpContext.Response.CompleteAsync();

                    return;
                }

                var session = await repository.GetById(sessionId);
                if (session.Locked)
                {
                    httpContext.Response.StatusCode = (int)HttpStatusCode.Conflict;
                    await httpContext.Response.CompleteAsync();

                    return;
                }
            }

            await this.next(httpContext);
        }

        private async Task<bool> SpecialCaseForUnlockingAsync(HttpContext httpContext)
        {
            if (httpContext.Request.Path.ToString().EndsWith("events") && httpContext.Request.Method == HttpMethods.Post)
            {
                var bodyStr = string.Empty;
                var req = httpContext.Request;

                // magic from https://dev.to/alialp/peeking-at-httpcontext-request-body-without-consuming-it-4if5
                req.EnableBuffering();
                using (StreamReader reader
                          = new StreamReader(req.Body, Encoding.UTF8, true, 1024, true))
                {
                    bodyStr = await reader.ReadToEndAsync();
                }

                req.Body.Position = 0;

                if (bodyStr.Contains($"\"eventType\":\"{nameof(UnlockSession)}\""))
                {
                    return true;
                }
            }

            return false;
        }
    }
}
