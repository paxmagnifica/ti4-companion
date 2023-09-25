using Newtonsoft.Json;
using Server.Domain.Exceptions;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Domain.Katowice
{
    public class Nomination : IHandler
    {
        private readonly IRepository repository;

        public Nomination(IRepository repository)
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

            var nominationEvents = session.Events.Where(ev => ev.EventType == nameof(Nomination));
            var expectedNominationEventsCount = session.GetGameStartedInfo().RandomPlayerOrder.Length * 2;

            if (nominationEvents.Count() == expectedNominationEventsCount)
            {
                throw new ConflictException("nominations_done");
            }

            var eventWhereFactionUsed = session.Events.LastOrDefault(ev => GetPayload(ev).Faction == currentEventPayload.Faction);
            var payloadWhereFactionUsed = eventWhereFactionUsed == null ? null : GetPayload(eventWhereFactionUsed);

            var confirmingNomination = currentEventPayload.Action == Constants.ConfirmAction && payloadWhereFactionUsed?.Action == Constants.NominateAction;

            var duplicatingAction = payloadWhereFactionUsed != null && !confirmingNomination;
            if (duplicatingAction)
            {
                throw new ConflictException("already_nominated_confirmed");
            }

            var confirmingWithoutNomination = currentEventPayload.Action == Constants.ConfirmAction && payloadWhereFactionUsed == null;
            if (confirmingWithoutNomination)
            {
                throw new ConflictException("confirming_without_nomination");
            }

            session.Events.Add(gameEvent);

            this.repository.UpdateSession(session);

            await this.repository.SaveChangesAsync();
        }

        internal static NominationPayload GetPayload(GameEvent gameEvent)
        {
            return GetPayload(gameEvent.SerializedPayload);
        }

        internal static NominationPayload GetPayload(string serializedPayload)
        {
            return JsonConvert.DeserializeObject<NominationPayload>(serializedPayload);
        }
    }
}
