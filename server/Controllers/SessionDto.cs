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
            Factions = GetFactions(session.Events);
            Points = GetPoints(session.Events);
            Objectives = GetObjectives(session.Events);
        }

        public List<ScorableObjectiveDto> Objectives { get; internal set; }
        private List<ScorableObjectiveDto> GetObjectives(List<GameEvent> events)
        {
            IEnumerable<GameEvent> objectivesAddedEvents = (events ?? new List<GameEvent>())
                .Where(ge => ge.EventType == nameof(ObjectiveAdded))
                .OrderBy(ge => ge.HappenedAt);

            IEnumerable<GameEvent> objectivesScoredEvents = (events ?? new List<GameEvent>())
                .Where(ge => ge.EventType == nameof(ObjectiveScored))
                .OrderBy(ge => ge.HappenedAt);

            var objectiveDictionary = new Dictionary<string, List<string>>();
            foreach (var gameEvent in objectivesAddedEvents)
            {
                // TODO isn't this hacky and ugly? :(
                var payload = ObjectiveAdded.GetPayload(gameEvent);
                objectiveDictionary[payload.Slug] = new List<string>();
            }

            foreach (var gameEvent in objectivesScoredEvents)
            {
                // TODO isn't this hacky and ugly? :(
                var payload = ObjectiveScored.GetPayload(gameEvent);
                objectiveDictionary[payload.Slug] = payload.ScoredBy;
            }

            return objectiveDictionary.ToArray().Select(kvp => new ScorableObjectiveDto
            {
                Slug = kvp.Key,
                ScoredBy = kvp.Value,
            }).ToList();
        }

        public List<string> Factions { get; internal set; }
        private List<String> GetFactions(List<GameEvent> events)
        {
            var gameStartEvent = events.FirstOrDefault(e => e.EventType == GameEvent.GameStarted);

            if (gameStartEvent == null)
            {
                // TODO domain exception
                throw new Exception("game session without factions event");
            }

            return JsonConvert.DeserializeObject<List<string>>(gameStartEvent.SerializedPayload);
        }

        public List<FactionPoint> Points { get; internal set; }
        private List<FactionPoint> GetPoints(List<GameEvent> events)
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

            return points.ToArray().Select(kvp => new FactionPoint
            {
                Faction = kvp.Key,
                Points = kvp.Value
            }).ToList();
        }
    }

    public class ScorableObjectiveDto
    {
        public string Slug { get; set; }
        public List<string> ScoredBy { get; set; }
    }
}
