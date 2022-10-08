using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace Server
{
    public class SessionHub : Hub
    {
        public async Task UnsubscribeFromSession(Guid session)
        {
            await this.Groups.RemoveFromGroupAsync(this.Context.ConnectionId, session.ToString());
            await this.Clients.Caller.SendAsync("UnsubscribedFromSession", session);
        }

        public async Task SubscribeToSession(Guid session)
        {
            await this.Groups.AddToGroupAsync(this.Context.ConnectionId, session.ToString());
            await this.Clients.Caller.SendAsync("SubscribedToSession", session);
        }
    }
}
