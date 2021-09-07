using System.Threading.Tasks;

namespace server.Domain
{
    public class FactionsShuffled: IHandler
    {
        public Task Handle(GameEvent gameEvent)
        {
            return Task.CompletedTask;
        }
    }
}
