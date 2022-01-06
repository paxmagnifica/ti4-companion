using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace server.Domain
{
    public class LawRemoved: IHandler
    {
        private readonly IRepository _repository;

        public LawRemoved(IRepository repository)
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

        public static LawRemovedPayload GetPayload(GameEvent gameEvent)
        {
            return GetPayload(gameEvent.SerializedPayload);
        }

        public static LawRemovedPayload GetPayload(string serializedPayload)
        {
            return JsonConvert.DeserializeObject<LawRemovedPayload>(serializedPayload);
        }
    }

    public class LawRemovedPayload
    {
        public string Slug { get; set; }
    }
}
