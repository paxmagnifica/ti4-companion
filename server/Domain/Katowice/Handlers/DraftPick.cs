using Newtonsoft.Json;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Domain.Katowice
{
    public class DraftPick : IHandler
    {
        private readonly IRepository repository;

        public DraftPick(IRepository repository)
        {
            this.repository = repository;
        }

        public async Task Handle(GameEvent gameEvent)
        {
            var session = await this.repository.GetByIdWithEvents(gameEvent.SessionId);

            if (session.Events == null)
            {
                // error
            }

            // TODO checks:
            // check if action is the same as current player
            // check if playerindex is the same as current player
            // check if confirming without nomination
            // check if not duplicated (nominating nominated/confirmed or confirming confirmed)
            session.Events.Add(gameEvent);

            var gameStartEvent = GameStarted.GetPayload(session.Events.First(ev => ev.EventType == nameof(GameStarted)));
            if (session.Events.Count(ge => ge.EventType == nameof(DraftPick)) == gameStartEvent.RandomPlayerOrder.Length * 3)
            {
                var draftPickPayloads = session.Events.Where(ge => ge.EventType == nameof(DraftPick)).Select(ge => DraftPick.GetPayload(ge));
                var commitDraftEvent = new GameEvent
                {
                    EventType = nameof(CommitDraft),
                    HappenedAt = gameEvent.HappenedAt.AddMilliseconds(1),
                    SerializedPayload = JsonConvert.SerializeObject(new CommitDraftPayload
                    {
                        Factions = draftPickPayloads.Where(faction => faction.Action == Constants.FactionAction).OrderBy(faction => faction.PlayerIndex).Select(faction => faction.Choice).ToArray(),
                        Initiative = draftPickPayloads.Where(init => init.Action == Constants.InitiativeAction).OrderBy(init => init.PlayerIndex).Select(init => int.Parse(init.Choice)).ToArray(),
                        TablePositions = draftPickPayloads.Where(table => table.Action == Constants.TablePositionAction).OrderBy(table => table.PlayerIndex).Select(table => int.Parse(table.Choice)).ToArray(),
                    }),
                };

                session.Events.Add(commitDraftEvent);
            }

            this.repository.UpdateSession(session);

            await this.repository.SaveChangesAsync();
        }

        internal static DraftPickPayload GetPayload(GameEvent gameEvent)
        {
            return GetPayload(gameEvent.SerializedPayload);
        }

        internal static DraftPickPayload GetPayload(string serializedPayload)
        {
            return JsonConvert.DeserializeObject<DraftPickPayload>(serializedPayload);
        }
    }
}
