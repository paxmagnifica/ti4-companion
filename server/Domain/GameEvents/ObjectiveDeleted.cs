using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace server.Domain
{
    public class ObjectiveDeleted : IHandler
    {
        private readonly IRepository _repository;

        public ObjectiveDeleted(IRepository repository)
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

        internal static ObjectiveDeletedPayload GetPayload(GameEvent gameEvent)
        {
            return JsonConvert.DeserializeObject<ObjectiveDeletedPayload>(gameEvent.SerializedPayload);
        }
    }

    internal class ObjectiveDeletedPayload
    {
        public string Slug { get; set; }
    }
}
