using Newtonsoft.Json;
using Server.Domain.Exceptions;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Domain.Katowice
{
    public class PickBan : IHandler
    {
        private readonly IRepository repository;

        public PickBan(IRepository repository)
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

            var currentEventPayload = GetPayload(gameEvent);
            var pickBanEvents = session.Events.Where(ev => ev.EventType == nameof(PickBan));
            var expectedNumberOfPickBanEvents = session.GetGameStartedInfo().RandomPlayerOrder.Length * 2;

            if (pickBanEvents.Count() == expectedNumberOfPickBanEvents)
            {
                throw new ConflictException("pick_bans_done");
            }

            var factionAlreadyUsed = pickBanEvents.Any(ev => GetPayload(ev).Faction == currentEventPayload.Faction);
            if (factionAlreadyUsed)
            {
                throw new ConflictException("faction_already_used");
            }

            session.Events.Add(gameEvent);

            this.repository.UpdateSession(session);

            await this.repository.SaveChangesAsync();
        }

        internal static PickBanPayload GetPayload(GameEvent gameEvent)
        {
            return GetPayload(gameEvent.SerializedPayload);
        }

        internal static PickBanPayload GetPayload(string serializedPayload)
        {
            return JsonConvert.DeserializeObject<PickBanPayload>(serializedPayload);
        }
    }
}
