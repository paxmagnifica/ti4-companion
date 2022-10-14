using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.Domain
{
    public class LawRemoved : IHandler
    {
        private readonly IRepository repository;

        public LawRemoved(IRepository repository)
        {
            this.repository = repository;
        }

        public static LawRemovedPayload GetPayload(GameEvent gameEvent)
        {
            return GetPayload(gameEvent.SerializedPayload);
        }

        public static LawRemovedPayload GetPayload(string serializedPayload)
        {
            return JsonConvert.DeserializeObject<LawRemovedPayload>(serializedPayload);
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
    }
}
