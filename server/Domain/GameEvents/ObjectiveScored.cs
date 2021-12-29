using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace server.Domain
{
    public class ObjectiveScored: IHandler
    {
        private readonly IRepository _repository;

        public ObjectiveScored(IRepository repository)
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

        internal static ObjectiveScoredPayload GetPayload(GameEvent gameEvent)
        {
            return JsonConvert.DeserializeObject<ObjectiveScoredPayload>(gameEvent.SerializedPayload);
        }

        internal static ObjectiveScoredPayload GetPayload(string serializedPayload)
        {
            return JsonConvert.DeserializeObject<ObjectiveScoredPayload>(serializedPayload);
        }
    }

    public class ObjectiveScoredPayload
    {
        public string Slug { get; set; }
        public string Faction { get; set; }
    }
}
