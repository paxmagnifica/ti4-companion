using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Server.Domain
{
    public class Timeline
    {
        private IOrderedEnumerable<GameEvent> originalOrderedEvents;
        private IOrderedEnumerable<GameEvent> orderedEvents;
        private bool addDraftSummary = false;
        private bool addSessionSummary = false;
        private bool deduplicate = false;
        private bool addDeltas = false;

        public Timeline(Session session)
        {
            this.originalOrderedEvents = session.Events.OrderBy(e => e.HappenedAt);
            this.orderedEvents = session.Events.OrderBy(e => e.HappenedAt);
        }

        public Timeline AddDraftSummary()
        {
            this.addDraftSummary = true;

            return this;
        }

        public Timeline AddSessionSummary()
        {
            this.addSessionSummary = true;

            return this;
        }

        public Timeline Deduplicate()
        {
            this.deduplicate = true;

            return this;
        }

        public Timeline CalculateDeltas()
        {
            this.addDeltas = true;

            return this;
        }

        public IEnumerable<TimelineEvent> GetEvents()
        {
            var events = this.GenerateTimelineEvents();

            if (this.addSessionSummary)
            {
                events = this.AddSessionSummary(events);
                this.addSessionSummary = false;
            }

            if (this.addDraftSummary)
            {
                events = this.AddDraftSummary(events);
                this.addDraftSummary = false;
            }

            if (this.deduplicate)
            {
                events = this.Deduplicate(events);
                this.deduplicate = false;
            }

            if (this.addDeltas)
            {
                events = this.CalculateDeltas(events);
                this.addDeltas = false;
            }

            return events.Select((e, index) =>
            {
                e.Order = index;
                return e;
            });
        }

        private IEnumerable<TimelineEvent> GenerateTimelineEvents()
        {
            var defaultVpCount = 10;
            var previousVpCount = defaultVpCount;
            var timelineEvents = new List<KeyValuePair<GameEvent, TimelineEvent>>();

            foreach (var sessionEvent in this.orderedEvents)
            {
                if (sessionEvent.EventType == nameof(MetadataUpdated))
                {
                    var payload = MetadataUpdated.GetPayload(sessionEvent);
                    if (payload.VpCount == previousVpCount)
                    {
                        continue;
                    }

                    var newPayload = JsonConvert.SerializeObject(new { from = previousVpCount, to = payload.VpCount });
                    previousVpCount = payload.VpCount;
                    timelineEvents.Add(KeyValuePair.Create(sessionEvent, new TimelineEvent
                    {
                        EventType = "VpCountChanged",
                        SerializedPayload = newPayload,
                        HappenedAt = sessionEvent.HappenedAt,
                    }));

                    continue;
                }

#if DEBUG
                if (sessionEvent.EventType == GameEvent.TimelineUserEvent || sessionEvent.EventType == GameEvent.MapAdded)
                {
                    timelineEvents.Add(KeyValuePair.Create(sessionEvent, new TimelineEvent
                    {
                        EventType = sessionEvent.EventType,
                        SerializedPayload = sessionEvent.SerializedPayload.Replace("storage-emulator", "localhost"),
                        HappenedAt = sessionEvent.HappenedAt,
                    }));
                    continue;
                }
#endif

                timelineEvents.Add(KeyValuePair.Create(sessionEvent, new TimelineEvent
                {
                    EventType = sessionEvent.EventType,
                    SerializedPayload = sessionEvent.SerializedPayload,
                    HappenedAt = sessionEvent.HappenedAt,
                }));
            }

            var withoutVPFromObjectives = this.MergeVictoryPointsAndScoredObjectives(timelineEvents.Select(kvp => kvp.Value));

            return withoutVPFromObjectives;
        }

        private IEnumerable<TimelineEvent> MergeVictoryPointsAndScoredObjectives(IEnumerable<TimelineEvent> timelineEvents)
        {
            var objectiveScoredEvents = timelineEvents.Where(e => e.EventType == nameof(ObjectiveScored));
            var withoutScoredObjectives = timelineEvents.Where(e => e.EventType != nameof(VictoryPointsUpdated) || !this.IsVictoryPointFromObjective(e, objectiveScoredEvents));

            var objectiveDescoredEvents = timelineEvents.Where(e => e.EventType == nameof(ObjectiveDescored));
            var withoutDescoredObjectives = withoutScoredObjectives.Where(e => e.EventType != nameof(VictoryPointsUpdated) || !this.IsVictoryPointFromObjective(e, objectiveDescoredEvents));

            return withoutDescoredObjectives;
        }

        private bool IsVictoryPointFromObjective(TimelineEvent e, IEnumerable<TimelineEvent> objectiveScoredEvents)
        {
            if (e.EventType != nameof(VictoryPointsUpdated))
            {
                return false;
            }

            var ePayload = VictoryPointsUpdated.GetPayload(e.SerializedPayload);
            var inObjectiveScoredEvents = objectiveScoredEvents.Any(objectiveEvent => objectiveEvent.SerializedPayload.Contains($"\"points\":{ePayload.Points}") && objectiveEvent.SerializedPayload.Contains($"\"faction\":\"{ePayload.Faction}\""));

            return e.EventType == nameof(VictoryPointsUpdated) && inObjectiveScoredEvents;
        }

        private IEnumerable<TimelineEvent> AddDraftSummary(IEnumerable<TimelineEvent> timelineEvents)
        {
            var commitDraftEvent = timelineEvents.FirstOrDefault(e => e.EventType == nameof(CommitDraft));
            if (commitDraftEvent == null)
            {
                return timelineEvents;
            }
            var gameStartedEvent = timelineEvents.FirstOrDefault(e => e.EventType == nameof(GameStarted));
            var draftOptions = gameStartedEvent == null ? null : GameStarted.GetPayload(gameStartedEvent.SerializedPayload).Options;

            var picks = timelineEvents.Where(e => e.EventType == nameof(Picked)).OrderBy(e => Picked.GetPayload(e.SerializedPayload).PlayerIndex);
            var playerPicks = new Dictionary<string, (string, int)>();

            foreach (var pick in picks)
            {
                var pickPayload = Picked.GetPayload(pick.SerializedPayload);
                if (!playerPicks.ContainsKey(pickPayload.PlayerName))
                {
                    playerPicks[pickPayload.PlayerName] = (string.Empty, -1);
                }

                if (pickPayload.Type == "faction")
                {
                    playerPicks[pickPayload.PlayerName] = (pickPayload.Pick, playerPicks[pickPayload.PlayerName].Item2);
                }

                if (pickPayload.Type == "tablePosition")
                {
                    playerPicks[pickPayload.PlayerName] = (playerPicks[pickPayload.PlayerName].Item1, int.Parse(pickPayload.Pick));
                }
            }

            var speakerName = this.GetSpeakerName(timelineEvents);
            var commitDraftIndex = timelineEvents.ToList().FindIndex(e => e.EventType == nameof(CommitDraft));
            var draftSummary = new TimelineEvent
            {
                EventType = "DraftSummary",
                HappenedAt = commitDraftEvent.HappenedAt,
                SerializedPayload = JsonConvert.SerializeObject(new
                {
                    speaker = speakerName,
                    picks = playerPicks.Select(kvp => {
                        var tablePositionName = draftOptions?.MapPositionNames.Length > 0
                            ? draftOptions?.MapPositionNames[kvp.Value.Item2]
                            : kvp.Value.Item2.ToString();

                        return new {
                            playerName = kvp.Key,
                            faction = kvp.Value.Item1,
                            tablePosition = tablePositionName
                        };
                    }),
                }),
            };
            var timelineEventsWithDraftSummary = new List<TimelineEvent>(timelineEvents);
            timelineEventsWithDraftSummary.Insert(commitDraftIndex + 1, draftSummary);

            return timelineEventsWithDraftSummary;
        }

        private object GetSpeakerName(IEnumerable<TimelineEvent> timelineEvents)
        {
            var speakerSelectedEvent = timelineEvents.LastOrDefault(e => e.EventType == nameof(SpeakerSelected));

            if (speakerSelectedEvent != null)
            {
                return SpeakerSelected.GetPayload(speakerSelectedEvent.SerializedPayload).SpeakerName;
            }

            var speakerPickedEvent = timelineEvents.LastOrDefault(e => e.EventType == nameof(Picked) && Picked.GetPayload(e.SerializedPayload).Type == "speaker");

            if (speakerPickedEvent != null)
            {
                return Picked.GetPayload(speakerPickedEvent.SerializedPayload).PlayerName;
            }

            return string.Empty;
        }

        private IEnumerable<TimelineEvent> Deduplicate(IEnumerable<TimelineEvent> possiblyDuplicatedEvents)
        {
            var deduplicatedVpScored = this.DeduplicateVp(possiblyDuplicatedEvents);
            var deduplicatedObjectives = this.DeduplicateObjectives(deduplicatedVpScored);

            return deduplicatedObjectives;
        }

        private IEnumerable<TimelineEvent> DeduplicateVp(IEnumerable<TimelineEvent> possiblyDuplicatedEvents)
        {
            var deduplicated = new List<TimelineEvent>();

            var faction = string.Empty;
            var factionVPHistory = new Dictionary<string, List<int>>();

            foreach (var timelineEvent in possiblyDuplicatedEvents.OrderBy(pde => pde.Order))
            {
                if (timelineEvent.EventType != nameof(VictoryPointsUpdated))
                {
                    deduplicated.Add(timelineEvent);
                    continue;
                }

                var payload = VictoryPointsUpdated.GetPayload(timelineEvent.SerializedPayload);
                var previousFaction = faction;
                faction = payload.Faction;

                if (!factionVPHistory.ContainsKey(payload.Faction))
                {
                    factionVPHistory.Add(payload.Faction, new List<int>());
                    factionVPHistory[payload.Faction].Add(0);
                    factionVPHistory[payload.Faction].Add(payload.Points);

                    deduplicated.Add(timelineEvent);
                    continue;
                }

                if (previousFaction != faction)
                {
                    deduplicated.Add(timelineEvent);
                    continue;
                }

                var secondToLast = factionVPHistory[payload.Faction][factionVPHistory[payload.Faction].Count - 2];
                if (payload.Points != secondToLast)
                {
                    deduplicated.Add(timelineEvent);
                    continue;
                }

                deduplicated.RemoveAt(deduplicated.Count - 1);
            }

            return deduplicated;
        }

        private IEnumerable<TimelineEvent> DeduplicateObjectives(IEnumerable<TimelineEvent> possiblyDuplicatedEvents)
        {
            var deduplicated = new List<TimelineEvent>();
            var typesWeCareAbout = new string[] { nameof(ObjectiveScored), nameof(ObjectiveDescored) };

            var factionJustScored = string.Empty;
            var objectiveJustScored = string.Empty;
            foreach (var timelineEvent in possiblyDuplicatedEvents)
            {
                if (!typesWeCareAbout.Contains(timelineEvent.EventType))
                {
                    deduplicated.Add(timelineEvent);
                    continue;
                }

                if (timelineEvent.EventType == nameof(ObjectiveScored))
                {
                    var p = ObjectiveScored.GetPayload(timelineEvent.SerializedPayload);
                    factionJustScored = p.Faction;
                    objectiveJustScored = p.Slug;
                    deduplicated.Add(timelineEvent);
                    continue;
                }

                var payload = ObjectiveDescored.GetPayload(timelineEvent.SerializedPayload);

                if (factionJustScored == payload.Faction && objectiveJustScored == payload.Slug)
                {
                    deduplicated.RemoveAt(deduplicated.Count - 1);
                }

                factionJustScored = string.Empty;
                objectiveJustScored = string.Empty;
            }

            return deduplicated;
        }

        private IEnumerable<TimelineEvent> AddSessionSummary(IEnumerable<TimelineEvent> timelineEvents)
        {
            var targetVP = this.orderedEvents.LastOrDefault(e => e.EventType == nameof(MetadataUpdated));

            var targetVPCount = 10;
            if (targetVP != null)
            {
                var targetVPPayload = MetadataUpdated.GetPayload(targetVP);
                targetVPCount = targetVPPayload.VpCount;
            }

            var firstToScoreTargetVPCount = this.orderedEvents.FirstOrDefault(e => e.EventType == nameof(VictoryPointsUpdated) && e.SerializedPayload.Contains($"\"points\":{targetVPCount}"));

            if (firstToScoreTargetVPCount == null)
            {
                return timelineEvents;
            }

            var victoryPointsEvents = this.orderedEvents.Where(e => e.EventType == nameof(VictoryPointsUpdated));
            var payloads = victoryPointsEvents.Select(e => VictoryPointsUpdated.GetPayload(e.SerializedPayload));
            var payloadsByFaction = payloads.GroupBy(p => p.Faction);

            var withSessionSummary = new List<TimelineEvent>(timelineEvents);
            withSessionSummary.Add(new TimelineEvent
            {
                EventType = "SessionSummary",
                HappenedAt = firstToScoreTargetVPCount.HappenedAt,
                SerializedPayload = JsonConvert.SerializeObject(new
                {
                    winner = VictoryPointsUpdated.GetPayload(firstToScoreTargetVPCount.SerializedPayload).Faction,
                    results = payloadsByFaction.Select(pbf => new { faction = pbf.Key, points = pbf.Last().Points }),
                }),
            });

            return withSessionSummary;
        }

        private IEnumerable<TimelineEvent> CalculateDeltas(IEnumerable<TimelineEvent> timelineEvents)
        {
            var eventsWithDeltas = new List<TimelineEvent>(timelineEvents);
            var points = new Dictionary<string, int>();

            foreach (var timelineEvent in eventsWithDeltas)
            {
                if (timelineEvent.EventType == nameof(ObjectiveScored))
                {
                    var payload = ObjectiveScored.GetPayload(timelineEvent.SerializedPayload);
                    if (!points.ContainsKey(payload.Faction))
                    {
                        points.Add(payload.Faction, 0);
                    }

                    timelineEvent.FromPoints = points[payload.Faction];
                    points[payload.Faction] = payload.Points;
                }

                if (timelineEvent.EventType == nameof(VictoryPointsUpdated))
                {
                    var payload = VictoryPointsUpdated.GetPayload(timelineEvent.SerializedPayload);
                    if (!points.ContainsKey(payload.Faction))
                    {
                        points.Add(payload.Faction, 0);
                    }

                    timelineEvent.FromPoints = points[payload.Faction];
                    points[payload.Faction] = payload.Points;
                }
            }

            return timelineEvents;
        }
    }
}
