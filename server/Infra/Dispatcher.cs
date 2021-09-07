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
            return (_serviceProvider.GetService(Type.GetType($"server.Domain.{gameEvent.EventType.Capitalize()}", false)) as IHandler).Handle(gameEvent);
        }
    }
}
