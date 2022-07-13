using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace server.Domain
{
    public class Picked : IHandler
    {
        private readonly IRepository _repository;

        public Picked(IRepository repository)
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
            session.Events.Add(gameEvent);

            // TODO not tested territory
            var pickedPayload = GetPayload(gameEvent);
            var orderedEvents = session.Events.OrderBy(e => e.HappenedAt);
            if (pickedPayload.Type == "speaker")
            {
                var orderEvent = orderedEvents.LastOrDefault(e => e.EventType == "PlayerOrder");
                var order = JsonConvert.DeserializeObject<List<int>>(orderEvent.SerializedPayload);
                order.RemoveAt(order.Count - 1);
                order.Add(pickedPayload.PlayerIndex);
                session.Events.Add(new GameEvent
                {
                    SessionId = session.Id,
                    HappenedAt = gameEvent.HappenedAt.AddMilliseconds(1),
                    EventType = "PlayerOrder",
                    SerializedPayload = JsonConvert.SerializeObject(order),
                });
            }
            var gameStartEvent = orderedEvents.FirstOrDefault(e => e.EventType == nameof(GameStarted));
            var gameStartOptions = GameStarted.GetPayload(gameStartEvent).Options;
            var expectedPicksCount = gameStartOptions.PlayerCount;
            if (gameStartOptions.TablePick)
            {
                expectedPicksCount = expectedPicksCount * 2;
            }
            if (gameStartOptions.SpeakerPick)
            {
                expectedPicksCount += 1;
            }
            var pickEventsCount = session.Events.Count(e => e.EventType == nameof(Picked));
            if (pickEventsCount == expectedPicksCount)
            {
                // WARNING copied from CommitDraft
                // TODO we should implement proper CQRS and return CommitDraft event from here as a side effect
                var factionPicks = session.Events.Where(e => e.EventType == nameof(Picked)).Select(Picked.GetPayload).Where(fp => fp.Type == "faction").Select(fp => fp.Pick);
                var commitDraft = new GameEvent
                {
                    SessionId = session.Id,
                    HappenedAt = gameEvent.HappenedAt.AddMilliseconds(2),
                    EventType = nameof(CommitDraft),
                    SerializedPayload = JsonConvert.SerializeObject(new { factions = factionPicks })
                };
                session.Events.Add(commitDraft);
            }

            _repository.UpdateSession(session);

            await _repository.SaveChangesAsync();
        }

        internal static PickedPayload GetPayload(GameEvent gameEvent)
        {
            return GetPayload(gameEvent.SerializedPayload);
        }
        internal static PickedPayload GetPayload(string serializedPayload)
        {
            return JsonConvert.DeserializeObject<PickedPayload>(serializedPayload);
        }
    }

    public class PickedPayload
    {
        public string Pick { get; set; }
        public string Type { get; set; }
        public int PlayerIndex { get; set; }
        public string PlayerName { get; set; }
    }
}
