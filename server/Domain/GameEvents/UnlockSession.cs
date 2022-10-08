
using System.Threading.Tasks;

namespace Server.Domain
{
    public class UnlockSession : IHandler
    {
        private readonly IRepository repository;

        public UnlockSession(IRepository repository)
        {
            this.repository = repository;
        }

        public async Task Handle(GameEvent gameEvent)
        {
            var session = await this.repository.GetById(gameEvent.SessionId);

            session.Locked = false;
            this.repository.UpdateSession(session);

            await this.repository.SaveChangesAsync();
        }
    }
}
