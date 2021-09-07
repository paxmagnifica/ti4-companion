using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace server.Domain
{
    public class FactionsShuffled: IHandler
    {
        private readonly IRepository _repository;

        public FactionsShuffled(IRepository repository)
        {
            _repository = repository;
        }

        public async Task Handle(GameEvent gameEvent)
        {
            List<string> shuffledFactions = JsonConvert.DeserializeObject<List<string>>(gameEvent.SerializedPayload);

            var session = await _repository.GetById(gameEvent.SessionId);

            session.Factions = shuffledFactions;
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
