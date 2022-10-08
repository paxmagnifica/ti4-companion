using System.Threading.Tasks;

namespace server.Domain
{
    public class UnlockSession : IHandler
    {
        private readonly IRepository _repository;

        public UnlockSession(IRepository repository)
        {
            _repository = repository;
        }

        public async Task Handle(GameEvent gameEvent)
        {
            var session = await _repository.GetById(gameEvent.SessionId);

            session.Locked = false;
            _repository.UpdateSession(session);

            await _repository.SaveChangesAsync();
        }
    }
}
