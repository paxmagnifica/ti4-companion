using Server.Domain;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Server.Controllers
{
    public class SessionDto : Session
    {
        public SessionDto()
        {
        }

        public SessionDto(Session session)
        {
            this.Id = session.Id;
            this.Checksum = session.Events.OrderBy(e => e.HappenedAt).Last().Id;
            this.Setup = this.GetSetup(session.Events);
            this.IsKatowiceDraft = this.Setup.SetupType == Domain.Katowice.Constants.SetupType;

            this.Factions = this.GetFactions(session.Events);
            this.Points = this.GetPoints(session.Events);
            this.Objectives = this.GetObjectives(session.Events);
            this.Map = this.GetMap(session.Events);
            this.MapLink = this.GetMapLink(session.Events);
            this.CreatedAt = session.CreatedAt;
            this.Locked = session.Locked;
            this.Editable = !session.Locked;
            this.SetSessionDetails(session.Events);
            this.Draft = new DraftDto(session);
            this.Players = this.IsKatowiceDraft ? Domain.Katowice.Draft.GeneratePlayerDto(session) : PlayerDto.GetPlayers(this);
            this.Secured = !string.IsNullOrEmpty(session.HashedPassword);
            this.MapPositions = this.GetMapPositions(session.Events);

            this.KatowiceDraft = this.IsKatowiceDraft ? Domain.Katowice.Draft.GetDto(session) : null;

            this.Setup.Password = null;
        }

        public Guid Checksum { get; set; }

        public bool IsKatowiceDraft { get; set; }

        public Domain.Katowice.DraftDto KatowiceDraft { get; set; }

        public DraftDto Draft { get; set; }

        public bool Secured { get; set; }

        public bool IsDraft
        {
            get { return !this.Factions.Any(); }
        }

        public GameStartedPayload Setup { get; set; }

        public Guid Secret { get; set; }

        public bool Editable { get; internal set; }

        public bool Finished
        {
            get
            {
                return this.Points.Any(point => point.Points >= this.VpCount);
            }
        }

        public string DisplayName { get; internal set; }

        public bool TTS { get; internal set; }

        public bool Split { get; internal set; }

        public string Start { get; internal set; }

        public string End { get; internal set; }

        public decimal Duration { get; internal set; }

        public int VpCount { get; internal set; }

        public Dictionary<string, string> Colors { get; set; }

        public IEnumerable<PlayerDto> Players { get; internal set; }

        public string Map { get; internal set; }

        public string MapLink { get; internal set; }

        public List<MapPosition> MapPositions { get; internal set; }

        public List<ScorableObjectiveDto> Objectives { get; internal set; }

        public List<string> Factions { get; set; }

        public List<FactionPoint> Points { get; internal set; }

        private List<MapPosition> GetMapPositions(List<GameEvent> events)
        {
            var initialMapPositions = new List<MapPosition>(this.Setup?.Options?.MapPositions ?? new MapPosition[0]);

            var mapPositionsFromUpdatedMetadata = this.GetLatestMetadataEventPayload(events)?.MapPositions;

            return mapPositionsFromUpdatedMetadata ?? initialMapPositions;
        }

        private GameStartedPayload GetSetup(List<GameEvent> events)
        {
            var gameStartEvent = events.FirstOrDefault(e => e.EventType == nameof(GameStarted));

            return GameStarted.GetPayload(gameStartEvent);
        }

        private void SetSessionDetails(List<GameEvent> events)
        {
            this.VpCount = 10;
            var payload = this.GetLatestMetadataEventPayload(events);
            if (payload == null)
            {
                return;
            }

            this.DisplayName = payload.SessionDisplayName;
            this.TTS = payload.IsTTS;
            this.Split = payload.IsSplit;
            this.Start = payload.SessionStart;
            this.End = payload.SessionEnd;
            this.Duration = payload.Duration;
            this.VpCount = payload.VpCount == 0 ? 10 : payload.VpCount;
            this.Colors = payload.Colors;
        }

        private MetadataUpdatedPayload GetLatestMetadataEventPayload(List<GameEvent> events)
        {
            var latestMetadataEvent = (events ?? new List<GameEvent>())
                .OrderByDescending(e => e.HappenedAt)
                .FirstOrDefault(e => e.EventType == nameof(MetadataUpdated));

            if (latestMetadataEvent == null)
            {
                return null;
            }

            return MetadataUpdated.GetPayload(latestMetadataEvent);
        }

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

        private string GetMapLink(List<GameEvent> events)
        {
            var mapLinkEvent = (events ?? new List<GameEvent>()).OrderByDescending(e => e.HappenedAt).LastOrDefault(e => e.EventType == nameof(MapLinkUpdated));

            if (mapLinkEvent == null)
            {
                return string.Empty;
            }

            return mapLinkEvent.SerializedPayload.Trim('"');
        }

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

        private List<string> GetFactions(List<GameEvent> events)
        {
            var gameStartEvent = events.FirstOrDefault(e => e.EventType == nameof(GameStarted));

            var draftCommitedEvent = events.FirstOrDefault(e => e.EventType == nameof(CommitDraft));
            if (draftCommitedEvent != null)
            {
                return new List<string>(CommitDraft.GetPayload(draftCommitedEvent).Factions);
            }

            var lastShuffle = events.OrderByDescending(e => e.HappenedAt).FirstOrDefault(e => e.EventType == nameof(FactionsShuffled));
            if (lastShuffle == null)
            {
                var payload = GameStarted.GetPayload(gameStartEvent);

                return payload.Factions;
            }

            return FactionsShuffled.GetPayload(lastShuffle).Factions;
        }

        private List<FactionPoint> GetPoints(List<GameEvent> events)
        {
            Dictionary<string, int> points = new Dictionary<string, int>();

            foreach (var faction in this.Factions)
            {
                points[faction] = 0;
            }

            IEnumerable<GameEvent> victoryPointEvents = (events ?? new List<GameEvent>())
                .Where(ge => ge.EventType == nameof(VictoryPointsUpdated))
                .OrderBy(ge => ge.HappenedAt);
            foreach (var gameEvent in victoryPointEvents)
            {
                var payload = VictoryPointsUpdated.GetPayload(gameEvent);
                points[payload.Faction] = payload.Points;
            }

            return points.ToArray().Select(kvp => new FactionPoint
            {
                Faction = kvp.Key,
                Points = kvp.Value,
            }).ToList();
        }
    }
}
