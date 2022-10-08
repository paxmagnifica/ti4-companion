using System.Threading.Tasks;

namespace Server.Domain
{
    internal interface IHandler
    {
        Task Handle(GameEvent gameEvent);
    }
}
