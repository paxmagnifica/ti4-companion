
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.Domain
{
    public class ObjectiveDescored : IHandler
    {
        private readonly IRepository repository;

        public ObjectiveDescored(IRepository repository)
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

        internal static ObjectiveDescoredPayload GetPayload(GameEvent gameEvent)
        {
            return JsonConvert.DeserializeObject<ObjectiveDescoredPayload>(gameEvent.SerializedPayload);
        }

        internal static ObjectiveDescoredPayload GetPayload(string serializedPayload)
        {
            return JsonConvert.DeserializeObject<ObjectiveDescoredPayload>(serializedPayload);
        }
    }

    public class ObjectiveDescoredPayload
    {
        public string Slug { get; set; }

        public string Faction { get; set; }

        public int Points { get; set; }
    }
}
