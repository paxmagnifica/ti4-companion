using System.Threading.Tasks;

namespace server.Domain
{
    interface IHandler
    {
        Task Handle(GameEvent gameEvent);
    }
}
