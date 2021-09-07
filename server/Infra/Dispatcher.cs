using System;
using System.Threading.Tasks;
using server.Domain;
using server.Extensions;

namespace server.Infra
{
    public class Dispatcher
    {
        private readonly IServiceProvider _serviceProvider;

        public Dispatcher(IServiceProvider serviceProvider)
        {
            this._serviceProvider = serviceProvider;
        }

        public Task Dispatch(GameEvent gameEvent)
        {
            var handlerType = Type.GetType($"server.Domain.{gameEvent.EventType.Capitalize()}", false);
            if (handlerType == null)
            {
                throw new HandlerNotFoundException(gameEvent.EventType.Capitalize());
            }

            var handler = (_serviceProvider.GetService(handlerType) as IHandler);
            if (handler == null)
            {
                throw new HandlerNotFoundException(gameEvent.EventType.Capitalize());
            }

            return handler.Handle(gameEvent);
        }
    }
}
