using System;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace server
{
    public class SessionHub : Hub
    {
        public async Task UnsubscribeFromSession(Guid session)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, session.ToString());
            await Clients.Caller.SendAsync("UnsubscribedFromSession", session);
        }

        public async Task SubscribeToSession(Guid session)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, session.ToString());
            await Clients.Caller.SendAsync("SubscribedToSession", session);
        }
    }
}
