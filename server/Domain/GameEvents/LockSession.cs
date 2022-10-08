//

using System.Threading.Tasks;

namespace Server.Domain
{
    public class LockSession : IHandler
    {
        private readonly IRepository repository;

        public LockSession(IRepository repository)
        {
            this.repository = repository;
        }

        public async Task Handle(GameEvent gameEvent)
        {
            var session = await this.repository.GetById(gameEvent.SessionId);

            session.Locked = true;
            this.repository.UpdateSession(session);

            await this.repository.SaveChangesAsync();
        }
    }
}
