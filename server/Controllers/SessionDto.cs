using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using server.Domain;

namespace server.Controllers
{
    public class PlayerDto
    {
        public string PlayerName { get; set; }
        public string Faction { get; set; }
        public string Color { get; set; }
        public bool Speaker { get; set; }
        public int AtTable { get; set; }

        public PlayerDto()
        {
            AtTable = -1;
        }

        public static IEnumerable<PlayerDto> GetPlayers(SessionDto session)
        {
            var factionPicks = session.Draft?.Picks?.Where(p => p.Type == "faction") ?? new PickedPayload[0];
            var tablePicks = session.Draft?.Picks?.Where(p => p.Type == "tablePosition") ?? new PickedPayload[0];

            var picks = session.Factions.Select(faction =>
            {

                var decapitalizedFaction = faction;
                decapitalizedFaction = Char.ToLower(decapitalizedFaction[0]) + decapitalizedFaction.Substring(1);
                var playerName = factionPicks.FirstOrDefault(fp => fp.Pick == faction)?.PlayerName;
                var tablePick = tablePicks.FirstOrDefault(tp => tp.PlayerName == playerName)?.Pick;

                return new PlayerDto
                {
                    Faction = faction,
                    PlayerName = playerName,
                    Color = session.Colors?.GetValueOrDefault(faction) ?? session.Colors?.GetValueOrDefault(decapitalizedFaction),
                    Speaker = playerName != null && session.Draft?.Speaker == playerName,
                    AtTable = Int32.Parse(tablePick ?? "-1")
                };
            });

            var speaker = session.Draft?.Speaker;

            if (!string.IsNullOrEmpty(speaker) && tablePicks.Any())
            {
                var ordered = tablePicks.OrderBy(tp => int.Parse(tp.Pick));
                var duplicated = ordered.Concat(ordered).ToList();
                var speakerIndex = duplicated.FindIndex(a => a.PlayerName == speaker);

                var inOrderAfterSpeaker = duplicated.Skip(speakerIndex).Take(picks.Count());

                return inOrderAfterSpeaker.Select(orderedPick => picks.First(pick => pick.PlayerName == orderedPick.PlayerName));
            }

            return picks;
        }
    }

    public class BanDto
    {
        public string Ban { get; set; }
        public string PlayerName { get; set; }
    }

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

            Order = JsonConvert.DeserializeObject<int[]>(orderEvent?.SerializedPayload ?? "[]");
            Phase = ((gameStartOptions?.Bans ?? false) && banEvents.Count() < banOrder.Count()) ? "bans" :
              (pickEvents.Count() < Order.Count() ? "picks" : "speaker");
            InitialPool = gameStartOptions?.InitialPool;
            Players = gameStartOptions?.Players ?? new string[0];
            BansPerRound = gameStartOptions?.BansPerRound ?? 1;
            Bans = bans;
            Picks = pickEvents.Select(Picked.GetPayload).ToArray();
            ActivePlayerIndex = Phase == "bans" ? banEvents.Count() : pickEvents.Count();

            var speakerEvent = orderedEvents.LastOrDefault(e => e.EventType == nameof(SpeakerSelected));
            if (speakerEvent != null)
            {
                Speaker = SpeakerSelected.GetPayload(speakerEvent).SpeakerName;
            }
        }

        public string[] InitialPool { get; set; }
        public string[] Players { get; set; }
        public BanDto[] Bans { get; set; }
        public PickedPayload[] Picks { get; set; }
        public int BansPerRound { get; set; }
        public string Phase { get; set; }
        public int[] Order { get; set; }
        public int ActivePlayerIndex { get; set; }
        public string Speaker { get; set; }
    }

    public class SessionDto : Session
    {
        public SessionDto()
        {
        }

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
            Draft = new DraftDto(session);
            Players = PlayerDto.GetPlayers(this);
            Secured = !string.IsNullOrEmpty(session.HashedPassword);

            Setup.Password = null;
        }

        public DraftDto Draft { get; set; }

        public bool Secured { get; set; }
        public bool IsDraft { get { return !Factions.Any(); } }
        public GameStartedPayload Setup { get; set; }
        private void SetupGameState(List<GameEvent> events)
        {
            var gameStartEvent = events.FirstOrDefault(e => e.EventType == nameof(GameStarted));

            Setup = GameStarted.GetPayload(gameStartEvent);
        }

        public Guid Secret { get; set; }
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
        public Dictionary<string, string> Colors { get; set; }
        public IEnumerable<PlayerDto> Players { get; internal set; }
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
            Colors = payload.Colors;
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

        public List<string> Factions { get; set; }
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
