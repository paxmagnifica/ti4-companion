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
            var session = await _repository.GetByIdWithEvents(gameEvent.SessionId);

            if (session.Events == null)
            {
                session.Events = new List<GameEvent>();
            }
            session.Events.Add(gameEvent);

            _repository.UpdateSession(session);

            await _repository.SaveChangesAsync();
        }

        internal static FactionsShuffledPayload GetPayload(GameEvent gameEvent)
        {
            return JsonConvert.DeserializeObject<FactionsShuffledPayload>(gameEvent.SerializedPayload);
        }
    }

    internal class FactionsShuffledPayload
    {
        public List<string> Factions { get; set; }
    }
}
