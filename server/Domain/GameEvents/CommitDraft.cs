using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace server.Domain
{
    public class CommitDraft : IHandler
    {
        private readonly IRepository _repository;

        public CommitDraft(IRepository repository)
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
            var factionPicks = session.Events.Where(e => e.EventType == nameof(Picked)).Select(Picked.GetPayload).Where(fp => fp.Type == "faction").Select(fp => fp.Pick);
            gameEvent.SerializedPayload = JsonConvert.SerializeObject(new { factions = factionPicks });
            session.Events.Add(gameEvent);

            _repository.UpdateSession(session);

            await _repository.SaveChangesAsync();
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
