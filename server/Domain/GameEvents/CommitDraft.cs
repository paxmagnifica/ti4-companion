
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Domain
{
    public class CommitDraft : IHandler
    {
        private readonly IRepository repository;

        public CommitDraft(IRepository repository)
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

            var factionPicks = session.Events.Where(e => e.EventType == nameof(Picked)).Select(Picked.GetPayload).Where(fp => fp.Type == "faction").Select(fp => fp.Pick);
            gameEvent.SerializedPayload = JsonConvert.SerializeObject(new { factions = factionPicks });
            session.Events.Add(gameEvent);

            this.repository.UpdateSession(session);

            await this.repository.SaveChangesAsync();
        }

        internal static CommitDraftPayload GetPayload(GameEvent gameEvent)
        {
            return JsonConvert.DeserializeObject<CommitDraftPayload>(gameEvent.SerializedPayload);
        }
    }

    public class CommitDraftPayload
    {
        public string[] Factions { get; set; }
    }
}
