using Newtonsoft.Json;
using server.Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Domain
{
    public class Picked : IHandler
    {
        private readonly IRepository repository;

        public Picked(IRepository repository)
        {
            this.repository = repository;
        }

        public async Task Handle(GameEvent gameEvent)
        {
            int counter = 0;
            var session = await this.repository.GetByIdWithEvents(gameEvent.SessionId);

            if (session.Events == null)
            {
                session.Events = new List<GameEvent>();
            }

            var orderedEvents = session.Events.OrderBy(e => e.HappenedAt);
            var gameStartEvent = orderedEvents.FirstOrDefault(e => e.EventType == nameof(GameStarted));
            var gameStartOptions = GameStarted.GetPayload(gameStartEvent).Options;
            var previousPickEvents = orderedEvents.Where(e => e.EventType == nameof(Picked));
            var pickedPayload = GetPayload(gameEvent);

            this.AssurePlayerCanPick(pickedPayload, previousPickEvents, gameStartOptions);

            session.Events.Add(gameEvent);

            // TODO not tested territory
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
                if (this.GetPickEventsCount(session) + 1 == expectedPicksCount && speakerPick == null)
                {
                    var orderEvent = orderedEvents.LastOrDefault(e => e.EventType == "PlayerOrder");
                    var order = JsonConvert.DeserializeObject<List<int>>(orderEvent.SerializedPayload);
                    var playersWithoutTheGuyWhoDidNotPickSpeakerAsLast = order.Skip(1).ToList();
                    var random = new Random();
                    int indexInList = random.Next(playersWithoutTheGuyWhoDidNotPickSpeakerAsLast.Count);
                    int speakerPlayerIndex = playersWithoutTheGuyWhoDidNotPickSpeakerAsLast[indexInList];

                    session.Events.Add(new GameEvent
                    {
                        SessionId = session.Id,
                        HappenedAt = gameEvent.HappenedAt.AddMilliseconds(++counter),
                        EventType = "Picked",
                        SerializedPayload = JsonConvert.SerializeObject(new PickedPayload
                        {
                            Pick = "speaker",
                            Type = "speaker",
                            PlayerIndex = speakerPlayerIndex,
                            PlayerName = gameStartOptions.Players[speakerPlayerIndex],
                        }),
                    });
                }

                if (this.GetPickEventsCount(session) == expectedPicksCount)
                {
                    // WARNING copied from CommitDraft
                    // TODO we should implement proper CQRS and return CommitDraft event from here as a side effect
                    var factionPicks = session.Events.Where(e => e.EventType == nameof(Picked)).Select(Picked.GetPayload).Where(fp => fp.Type == "faction").Select(fp => fp.Pick);
                    var commitDraft = new GameEvent
                    {
                        SessionId = session.Id,
                        HappenedAt = gameEvent.HappenedAt.AddMilliseconds(++counter),
                        EventType = nameof(CommitDraft),
                        SerializedPayload = JsonConvert.SerializeObject(new { factions = factionPicks }),
                    };
                    session.Events.Add(commitDraft);
                }
            }

            this.repository.UpdateSession(session);

            await this.repository.SaveChangesAsync();
        }

        internal static PickedPayload GetPayload(GameEvent gameEvent)
        {
            return GetPayload(gameEvent.SerializedPayload);
        }

        internal static PickedPayload GetPayload(string serializedPayload)
        {
            return JsonConvert.DeserializeObject<PickedPayload>(serializedPayload);
        }

        private void AssurePlayerCanPick(PickedPayload currentPickPayload, IEnumerable<GameEvent> previousPickEvents, DraftOptions gameStartOptions)
        {
            if (currentPickPayload.Type == "tablePosition" && !gameStartOptions.TablePick)
            {
                throw new TablePickNotAllowedException();
            }

            if (currentPickPayload.Type == "speaker" && !gameStartOptions.SpeakerPick)
            {
                throw new SpeakerPickNotAllowedException();
            }

            var payloads = previousPickEvents.Select(ppe => GetPayload(ppe.SerializedPayload));
            var previousPicksOfTheSameType = payloads.Where(ppe => ppe.PlayerName == currentPickPayload.PlayerName && ppe.Type == currentPickPayload.Type);
            if (previousPicksOfTheSameType.Count() >= 1)
            {
                throw new AlreadyDoneException();
            }
        }

        private int GetPickEventsCount(Session session)
        {
            return session.Events.Count(e => e.EventType == nameof(Picked));
        }
    }

    public class PickedPayload
    {
        public string Pick { get; set; }

        public string Type { get; set; } // "faction", "tablePosition"

        public int PlayerIndex { get; set; }

        public string PlayerName { get; set; }
    }
}
