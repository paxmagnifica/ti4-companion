using System;
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
            int counter = 0;
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
                    HappenedAt = gameEvent.HappenedAt.AddMilliseconds(++counter),
                    EventType = "PlayerOrder",
                    SerializedPayload = JsonConvert.SerializeObject(order),
                });
            }
            var gameStartEvent = orderedEvents.FirstOrDefault(e => e.EventType == nameof(GameStarted));
            var gameStartOptions = GameStarted.GetPayload(gameStartEvent).Options;
            if (gameStartOptions.SpeakerPick)
            {
                var expectedPicksCount = gameStartOptions.PlayerCount;
                if (gameStartOptions.TablePick)
                {
                    expectedPicksCount = expectedPicksCount * 2;
                }
                if (gameStartOptions.SpeakerPick)
                {
                    expectedPicksCount += 1;
                }

                var speakerPick = session.Events.Where(e => e.EventType == nameof(Picked)).Select(Picked.GetPayload).Where(fp => fp.Type == "speaker").FirstOrDefault();
                if (GetPickEventsCount(session) + 1 == expectedPicksCount && speakerPick == null)
                {
                    var orderEvent = orderedEvents.LastOrDefault(e => e.EventType == "PlayerOrder");
                    var order = JsonConvert.DeserializeObject<List<int>>(orderEvent.SerializedPayload);
                    var playersWithoutTheGuyWhoDidNotPickSpeakerAsLast = order.Skip(1).ToList();
                    var random = new Random();
                    int indexInList = random.Next(playersWithoutTheGuyWhoDidNotPickSpeakerAsLast.Count);
                    int speakerPlayerIndex = playersWithoutTheGuyWhoDidNotPickSpeakerAsLast[indexInList];

                    session.Events.Add(new GameEvent{
                        SessionId = session.Id,
                        HappenedAt = gameEvent.HappenedAt.AddMilliseconds(++counter),
                        EventType = "Picked",
                        SerializedPayload = JsonConvert.SerializeObject(new PickedPayload{
                            Pick = "speaker",
                            Type = "speaker",
                            PlayerIndex = speakerPlayerIndex,
                            PlayerName = gameStartOptions.Players[speakerPlayerIndex],
                        }),
                    });
                }

                if (GetPickEventsCount(session) == expectedPicksCount)
                {
                    // WARNING copied from CommitDraft
                    // TODO we should implement proper CQRS and return CommitDraft event from here as a side effect
                    var factionPicks = session.Events.Where(e => e.EventType == nameof(Picked)).Select(Picked.GetPayload).Where(fp => fp.Type == "faction").Select(fp => fp.Pick);
                    var commitDraft = new GameEvent
                    {
                        SessionId = session.Id,
                        HappenedAt = gameEvent.HappenedAt.AddMilliseconds(++counter),
                        EventType = nameof(CommitDraft),
                        SerializedPayload = JsonConvert.SerializeObject(new { factions = factionPicks })
                    };
                    session.Events.Add(commitDraft);
                }

            }
            _repository.UpdateSession(session);

            await _repository.SaveChangesAsync();
        }

        private int GetPickEventsCount(Session session)
        {
            return session.Events.Count(e => e.EventType == nameof(Picked));
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
