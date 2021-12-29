using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace server.Domain
{
    public class ObjectiveAdded: IHandler
    {
        private readonly IRepository _repository;

        public ObjectiveAdded(IRepository repository)
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

        internal static ObjectiveAddedPayload GetPayload(GameEvent gameEvent)
        {
            return JsonConvert.DeserializeObject<ObjectiveAddedPayload>(gameEvent.SerializedPayload);
        }
    }

    public class ObjectiveAddedPayload
    {
        public string Slug { get; set; }
    }
}
