//

using server.Domain;
using server.Extensions;
using System;
using System.Threading.Tasks;

namespace Server.Infra
{
    public class Dispatcher
    {
        private readonly IServiceProvider serviceProvider;

        public Dispatcher(IServiceProvider serviceProvider)
        {
            this.serviceProvider = serviceProvider;
        }

        public Task Dispatch(GameEvent gameEvent)
        {
            var handlerType = Type.GetType($"server.Domain.{gameEvent.EventType.Capitalize()}", false);
            if (handlerType == null)
            {
                throw new HandlerNotFoundException(gameEvent.EventType.Capitalize());
            }

            var handler = this.serviceProvider.GetService(handlerType) as IHandler;
            if (handler == null)
            {
                throw new HandlerNotFoundException(gameEvent.EventType.Capitalize());
            }

            return handler.Handle(gameEvent);
        }
    }
}
