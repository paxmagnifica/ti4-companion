using System.Threading.Tasks;

namespace server.Domain
{
    public class LockSession: IHandler
    {
        private readonly IRepository _repository;

        public LockSession(IRepository repository)
        {
            _repository = repository;
        }

        public async Task Handle(GameEvent gameEvent)
        {
            var session = await _repository.GetById(gameEvent.SessionId);

            session.Locked = true;
            _repository.UpdateSession(session);

            await _repository.SaveChangesAsync();
        }
    }
}
