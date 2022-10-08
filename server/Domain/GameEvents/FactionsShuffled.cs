//

using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.Domain
{
    public class FactionsShuffled : IHandler
    {
        private readonly IRepository repository;

        public FactionsShuffled(IRepository repository)
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
