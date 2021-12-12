using System;
using System.Collections.Generic;
using System.Linq;
using server.Domain;

namespace server.Controllers
{
    public class SessionDto : Session
    {
        public SessionDto(Session session)
        {
            Id = session.Id;
            SetupGameState(session.Events);
            Factions = GetFactions(session.Events);
            Points = GetPoints(session.Events);
            Objectives = GetObjectives(session.Events);
            Map = GetMap(session.Events);
            CreatedAt = session.CreatedAt;
            Locked = session.Locked;
            SetSessionDetails(session.Events);
        }

        public SessionDto(Session session, Guid? secret) : this(session)
        {
            Editable = secret.HasValue && session.CanEditWith(secret.Value);
            if (Editable)
            {
                Secret = secret.Value;
            }
        }

        public GameStartedPayload Setup { get; set; }
        public bool IsDraft { get { return Setup?.IsDraft ?? false; } }
        private void SetupGameState(List<GameEvent> events)
        {
            var gameStartEvent = events.FirstOrDefault(e => e.EventType == nameof(GameStarted));

            Setup = GameStarted.GetPayload(gameStartEvent);
        }

        public bool Editable { get; internal set; }
        public bool Finished
        {
            get
            {
                return Points.Any(point => point.Points == VpCount);
            }
        }

        public string DisplayName { get; internal set; }
        public bool TTS { get; internal set; }
        public bool Split { get; internal set; }
        public string Start { get; internal set; }
        public string End { get; internal set; }
        public decimal Duration { get; internal set; }
        public int VpCount { get; internal set; }
        private void SetSessionDetails(List<GameEvent> events)
        {
            VpCount = 10;
            var latestMetadataEvent = (events ?? new List<GameEvent>())
                .OrderByDescending(e => e.HappenedAt)
                .FirstOrDefault(e => e.EventType == nameof(MetadataUpdated));

            if (latestMetadataEvent == null)
            {
                return;
            }

            var payload = MetadataUpdated.GetPayload(latestMetadataEvent);
            DisplayName = payload.SessionDisplayName;
            TTS = payload.IsTTS;
            Split = payload.IsSplit;
            Start = payload.SessionStart;
            End = payload.SessionEnd;
            Duration = payload.Duration;
            VpCount = payload.VpCount == 0 ? 10 : payload.VpCount;
        }

        public string Map { get; internal set; }
        private string GetMap(List<GameEvent> events)
        {
            var mapEvent = (events ?? new List<GameEvent>()).OrderByDescending(e => e.HappenedAt).FirstOrDefault(e => e.EventType == GameEvent.MapAdded);

            if (mapEvent == null)
            {
                return string.Empty;
            }

#if DEBUG
            return mapEvent.SerializedPayload.Replace("storage-emulator", "localhost");
#endif

            return mapEvent.SerializedPayload;
        }

        public List<ScorableObjectiveDto> Objectives { get; internal set; }
        private List<ScorableObjectiveDto> GetObjectives(List<GameEvent> events)
        {
            IEnumerable<string> deletedObjectives = (events ?? new List<GameEvent>())
                .Where(ge => ge.EventType == nameof(ObjectiveDeleted))
                .Select(ge => ObjectiveDeleted.GetPayload(ge).Slug);
            var objectiveDictionary = new Dictionary<string, List<string>>();

            IEnumerable<string> objectiveSlugs = (events ?? new List<GameEvent>())
                .Where(ge => ge.EventType == nameof(ObjectiveAdded))
                .OrderBy(ge => ge.HappenedAt)
                .Select(ge => ObjectiveAdded.GetPayload(ge).Slug)
                .Except(deletedObjectives);
            foreach (var objectiveSlug in objectiveSlugs)
            {
                objectiveDictionary[objectiveSlug] = new List<string>();
            }

            IEnumerable<GameEvent> objectivesScoredEvents = (events ?? new List<GameEvent>())
                .Where(ge => ge.EventType == nameof(ObjectiveScored) || ge.EventType == nameof(ObjectiveDescored))
                .OrderBy(ge => ge.HappenedAt);
            foreach (var gameEvent in objectivesScoredEvents)
            {
                if (gameEvent.EventType == nameof(ObjectiveScored))
                {
                    var scoredPayload = ObjectiveScored.GetPayload(gameEvent);
                    if (objectiveDictionary.ContainsKey(scoredPayload.Slug))
                    {
                        objectiveDictionary[scoredPayload.Slug].Add(scoredPayload.Faction);
                    }
                }

                if (gameEvent.EventType == nameof(ObjectiveDescored))
                {
                    var descoredPayload = ObjectiveDescored.GetPayload(gameEvent);
                    if (objectiveDictionary.ContainsKey(descoredPayload.Slug))
                    {
                        objectiveDictionary[descoredPayload.Slug].Remove(descoredPayload.Faction);
                    }
                }
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
            var gameStartEvent = events.FirstOrDefault(e => e.EventType == nameof(GameStarted));
            var lastShuffle = events.OrderByDescending(e => e.HappenedAt).FirstOrDefault(e => e.EventType == nameof(FactionsShuffled));

            if (gameStartEvent == null && lastShuffle == null)
            {
                // TODO domain exception
                throw new Exception("game session without factions event");
            }

            if (lastShuffle == null)
            {
                var payload = GameStarted.GetPayload(gameStartEvent);

                return payload.Factions;
            }

            return FactionsShuffled.GetPayload(lastShuffle).Factions;
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
