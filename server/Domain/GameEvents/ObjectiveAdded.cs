using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.Domain
{
    public class ObjectiveAdded : IHandler
    {
        private readonly IRepository repository;

        public ObjectiveAdded(IRepository repository)
        {
            this.repository = repository;
        }

        public async Task Handle(GameEvent gameEvent)
        {
            var session = await this.repository.GetByIdWithEvents(gameEvent.SessionId);

            if (session.Events == null)
            {
                session.Events = new List<GameEvent>();
            }

            session.Events.Add(gameEvent);

            this.repository.UpdateSession(session);

            await this.repository.SaveChangesAsync();
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
