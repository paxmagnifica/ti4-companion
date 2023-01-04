using Newtonsoft.Json;
using Server.Domain;
using System.Linq;

namespace Server.Controllers
{
    public class DraftDto
    {
        public DraftDto()
        {
        }

        public DraftDto(Session session)
        {
            var orderedEvents = session.Events.OrderBy(e => e.HappenedAt);
            var gameStartEvent = orderedEvents.FirstOrDefault(e => e.EventType == nameof(GameStarted));
            var gameStartOptions = GameStarted.GetPayload(gameStartEvent).Options;

            var banEvents = session.Events.Where(e => e.EventType == nameof(Banned));
            var bans = banEvents.SelectMany(b =>
            {
                var payload = Banned.GetPayload(b);
                return payload.Bans.Select(f => new BanDto { Ban = f, PlayerName = payload.PlayerName });
            }).ToArray();
            var pickEvents = orderedEvents.Where(e => e.EventType == nameof(Picked));
            var banOrder = JsonConvert.DeserializeObject<int[]>(orderedEvents.FirstOrDefault(e => e.EventType == "PlayerOrder")?.SerializedPayload ?? "[]");
            var orderEvent = orderedEvents.LastOrDefault(e => e.EventType == "PlayerOrder");

            this.Order = JsonConvert.DeserializeObject<int[]>(orderEvent?.SerializedPayload ?? "[]");
            this.Phase = ((gameStartOptions?.Bans ?? false) && banEvents.Count() < banOrder.Count()) ? "bans" :
              (pickEvents.Count() < this.Order.Count() ? "picks" : "speaker");
            this.InitialPool = gameStartOptions?.InitialPool;
            this.Players = gameStartOptions?.Players ?? new string[0];
            this.MapPositionNames = gameStartOptions?.MapPositionNames ?? new string[0];
            this.BansPerRound = gameStartOptions?.BansPerRound ?? 1;
            this.Bans = bans;
            this.Picks = pickEvents.Select(Picked.GetPayload).ToArray();
            this.ActivePlayerIndex = this.Phase == "bans" ? banEvents.Count() : pickEvents.Count();

            var speakerSelectedEvent = orderedEvents.LastOrDefault(e => e.EventType == nameof(SpeakerSelected));
            if (speakerSelectedEvent != null)
            {
                this.Speaker = SpeakerSelected.GetPayload(speakerSelectedEvent).SpeakerName;
            }

            var speakerPickedEvent = pickEvents.LastOrDefault(e => Picked.GetPayload(e.SerializedPayload).Type == "speaker");
            if (speakerPickedEvent != null)
            {
                this.Speaker = Picked.GetPayload(speakerPickedEvent.SerializedPayload).PlayerName;
            }
        }

        public string[] InitialPool { get; set; }

        public string[] Players { get; set; }

        public string[] MapPositionNames { get; set; }

        public BanDto[] Bans { get; set; }

        public PickedPayload[] Picks { get; set; }

        public int BansPerRound { get; set; }

        public string Phase { get; set; }

        public int[] Order { get; set; }

        public int ActivePlayerIndex { get; set; }

        public string Speaker { get; set; }
    }
}
