using System.Net.Http;
using Microsoft.AspNetCore.Http;

namespace server.Infra
{
    public static class MiddlewareHelpers
    {
        public static bool SessionStateChangingRequests(HttpContext context)
        {
            return context.Request.Method == HttpMethod.Post.ToString() && !context.Request.Path.ToUriComponent().Contains("/edit") && SessionIdInRoute(context);
        }

        public static bool SessionIdInRoute(HttpContext context)
        {
            return context.Request.RouteValues.ContainsKey("sessionId");
        }

        public static bool IsProtected(HttpContext context)
        {
            return (context.Items.ContainsKey("Protect") && (bool)context.Items["Protect"]);
        }
    }
}
