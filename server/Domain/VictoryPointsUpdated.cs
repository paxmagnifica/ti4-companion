using System.Collections.Generic;
using System.Threading.Tasks;

namespace server.Domain
{
    public class VictoryPointsUpdated: IHandler
    {
        private readonly IRepository _repository;

        public VictoryPointsUpdated(IRepository repository)
        {
            _repository = repository;
        }

        public async Task Handle(GameEvent gameEvent)
        {
            var session = await _repository.GetById(gameEvent.SessionId);

            if (session.Events == null)
            {
                session.Events = new List<GameEvent>();
            }
            session.Events.Add(gameEvent);

            _repository.UpdateSession(session);

            await _repository.SaveChangesAsync();
        }
    }
}
