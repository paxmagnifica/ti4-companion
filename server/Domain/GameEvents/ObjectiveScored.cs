using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.Domain
{
    public class ObjectiveScored : IHandler
    {
        private readonly IRepository repository;

        public ObjectiveScored(IRepository repository)
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

        internal static ObjectiveScoredPayload GetPayload(GameEvent gameEvent)
        {
            return JsonConvert.DeserializeObject<ObjectiveScoredPayload>(gameEvent.SerializedPayload);
        }

        internal static ObjectiveScoredPayload GetPayload(string serializedPayload)
        {
            return JsonConvert.DeserializeObject<ObjectiveScoredPayload>(serializedPayload);
        }
    }
}
