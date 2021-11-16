using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using server.Domain;

namespace server.Infra
{
    public class PreventLockedSessionEditMiddleware
    {
        private readonly RequestDelegate _next;

        public PreventLockedSessionEditMiddleware(RequestDelegate next)
        {
            this._next = next;
        }

        public async Task Invoke(HttpContext httpContext, IRepository repository)
        {
            if (MiddlewareHelpers.SessionStateChangingRequests(httpContext))
            {
                Console.WriteLine("locked conflict check");
                var sessionIdIsGuid = Guid.TryParse(httpContext.Request.RouteValues["sessionId"].ToString(), out var sessionId);
                if (!sessionIdIsGuid)
                {
                    httpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    await httpContext.Response.CompleteAsync();

                    return;
                }

                var session = await repository.GetById(sessionId);
                Console.WriteLine(JsonConvert.SerializeObject(session));
                if (session.Locked)
                {
                    Console.WriteLine("real conflict");
                    httpContext.Response.StatusCode = (int)HttpStatusCode.Conflict;
                    await httpContext.Response.CompleteAsync();

                    return;
                }
            }

            await _next(httpContext);
        }
    }
}
