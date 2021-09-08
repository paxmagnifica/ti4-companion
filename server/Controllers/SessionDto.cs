using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using server.Domain;

namespace server.Controllers
{
    public class SessionDto: Session
    {
        public SessionDto(Session session)
        {
            Id = session.Id;
            SetFactions(session.Events);
            SetPoints(session.Events);
        }

        public List<string> Factions { get; internal set; }
        private void SetFactions(List<GameEvent> events)
        {
            var gameStartEvent = events.FirstOrDefault(e => e.EventType == GameEvent.GameStarted);

            if (gameStartEvent == null)
            {
                // TODO domain exception
                throw new Exception("game session without factions event");
            }

            Factions = JsonConvert.DeserializeObject<List<string>>(gameStartEvent.SerializedPayload);
        }

        public List<FactionPoint> Points { get; internal set; }
        private void SetPoints(List<GameEvent> events)
        {
            Dictionary<string, int> points = new Dictionary<string, int>();

            foreach (var faction in Factions)
            {
                points[faction] = 0;
            }

            IEnumerable<GameEvent> victoryPointEvents = (events ?? new List<GameEvent>())
                .Where(ge => ge.EventType == nameof(VictoryPointsUpdated))
                .OrderBy(ge => ge.HappenedAt);
            foreach (var gameEvent in victoryPointEvents)
            {
                // TODO isn't this hacky and ugly? :(
                var payload = VictoryPointsUpdated.GetPayload(gameEvent);
                points[payload.Faction] = payload.Points;
            }

            Points = points.ToArray().Select(kvp => new FactionPoint
            {
                Faction = kvp.Key,
                Points = kvp.Value
            }).ToList();
        }
    }
}
