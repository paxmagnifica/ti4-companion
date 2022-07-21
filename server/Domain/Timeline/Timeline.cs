using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace server.Domain
{
    public class Timeline
    {
        IOrderedEnumerable<GameEvent> _originalOrderedEvents;
        IOrderedEnumerable<GameEvent> _orderedEvents;
        bool _addDraftSummary = false;
        bool _addSessionSummary = false;
        bool _deduplicate = false;

        public Timeline(Session session)
        {
            _originalOrderedEvents = session.Events.OrderBy(e => e.HappenedAt);
            _orderedEvents = session.Events.OrderBy(e => e.HappenedAt);
        }

        public Timeline AddDraftSummary()
        {
            _addDraftSummary = true;

            return this;
        }

        public Timeline AddSessionSummary()
        {
            _addSessionSummary = true;

            return this;
        }

        public Timeline Deduplicate()
        {
            _deduplicate = true;

            return this;
        }

        public IEnumerable<TimelineEvent> GetEvents()
        {
            var events = GenerateTimelineEvents();

            if (_addSessionSummary)
            {
                events = AddSessionSummary(events);
                _addSessionSummary = false;
            }

            if (_addDraftSummary)
            {
                events = AddDraftSummary(events);
                _addDraftSummary = false;
            }

            if (_deduplicate)
            {
                events = Deduplicate(events);
                _deduplicate = false;
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

            foreach (var sessionEvent in _orderedEvents)
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
                        HappenedAt = sessionEvent.HappenedAt
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
                        HappenedAt = sessionEvent.HappenedAt
                    }));
                    continue;
                }
#endif

                timelineEvents.Add(KeyValuePair.Create(sessionEvent, new TimelineEvent
                {
                    EventType = sessionEvent.EventType,
                    SerializedPayload = sessionEvent.SerializedPayload,
                    HappenedAt = sessionEvent.HappenedAt
                }));
            }

            var withoutVPFromObjectives = MergeVictoryPointsAndScoredObjectives(timelineEvents.Select(kvp => kvp.Value));

            return withoutVPFromObjectives;
        }


        private IEnumerable<TimelineEvent> MergeVictoryPointsAndScoredObjectives(IEnumerable<TimelineEvent> timelineEvents)
        {
            var objectiveScoredEvents = timelineEvents.Where(e => e.EventType == nameof(ObjectiveScored));
            var withoutScoredObjectives = timelineEvents.Where(e => e.EventType != nameof(VictoryPointsUpdated) || !IsVictoryPointFromObjective(e, objectiveScoredEvents));

            var objectiveDescoredEvents = timelineEvents.Where(e => e.EventType == nameof(ObjectiveDescored));
            var withoutDescoredObjectives = withoutScoredObjectives.Where(e => e.EventType != nameof(VictoryPointsUpdated) || !IsVictoryPointFromObjective(e, objectiveDescoredEvents));

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

            var picks = timelineEvents.Where(e => e.EventType == nameof(Picked)).OrderBy(e => Picked.GetPayload(e.SerializedPayload).PlayerIndex);
            var playerPicks = new Dictionary<string, (string, int)>();

            foreach (var pick in picks)
            {
                var pickPayload = Picked.GetPayload(pick.SerializedPayload);
                if (!playerPicks.ContainsKey(pickPayload.PlayerName))
                {
                    playerPicks[pickPayload.PlayerName] = ("", -1);
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

            var speakerName = GetSpeakerName(timelineEvents);
            var commitDraftIndex = timelineEvents.ToList().FindIndex(e => e.EventType == nameof(CommitDraft));
            var draftSummary = new TimelineEvent
            {
                EventType = "DraftSummary",
                HappenedAt = commitDraftEvent.HappenedAt,
                SerializedPayload = JsonConvert.SerializeObject(new
                {
                    speaker = speakerName,
                    picks = playerPicks.Select(kvp => new { playerName = kvp.Key, faction = kvp.Value.Item1, tablePosition = kvp.Value.Item2 })
                })
            };
            var timelineEventsWithDraftSummary = new List<TimelineEvent>(timelineEvents);
            timelineEventsWithDraftSummary.Insert(commitDraftIndex + 1, draftSummary);

            return timelineEventsWithDraftSummary;
        }

        private object GetSpeakerName(IEnumerable<TimelineEvent> timelineEvents)
        {
            var speakerSelectedEvent = timelineEvents.LastOrDefault(e => e.EventType == nameof(SpeakerSelected));

            if (speakerSelectedEvent != null) {
                return SpeakerSelected.GetPayload(speakerSelectedEvent.SerializedPayload).SpeakerName;
            }

            var speakerPickedEvent = timelineEvents.LastOrDefault(e => e.EventType == nameof(Picked) && Picked.GetPayload(e.SerializedPayload).Type == "speaker");

            if (speakerPickedEvent != null) {
                return Picked.GetPayload(speakerPickedEvent.SerializedPayload).PlayerName;
            }

            return "";
        }

        private IEnumerable<TimelineEvent> Deduplicate(IEnumerable<TimelineEvent> possiblyDuplicatedEvents)
        {
            var deduplicatedVpScored = DeduplicateVp(possiblyDuplicatedEvents);
            var deduplicatedObjectives = DeduplicateObjectives(deduplicatedVpScored);

            return deduplicatedObjectives;
        }

        private IEnumerable<TimelineEvent> DeduplicateVp(IEnumerable<TimelineEvent> possiblyDuplicatedEvents)
        {
            var deduplicated = new List<TimelineEvent>();

            var faction = "";
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

            var factionJustScored = "";
            var objectiveJustScored = "";
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

                factionJustScored = "";
                objectiveJustScored = "";
            }

            return deduplicated;
        }

        private IEnumerable<TimelineEvent> AddSessionSummary(IEnumerable<TimelineEvent> timelineEvents)
        {
            var targetVP = _orderedEvents.LastOrDefault(e => e.EventType == nameof(MetadataUpdated));

            var targetVPCount = 10;
            if (targetVP != null)
            {
                var targetVPPayload = MetadataUpdated.GetPayload(targetVP);
                targetVPCount = targetVPPayload.VpCount;
            }

            var firstToScoreTargetVPCount = _orderedEvents.FirstOrDefault(e => e.EventType == nameof(VictoryPointsUpdated) && e.SerializedPayload.Contains($"\"points\":{targetVPCount}"));

            if (firstToScoreTargetVPCount == null)
            {
                return timelineEvents;
            }

            var victoryPointsEvents = _orderedEvents.Where(e => e.EventType == nameof(VictoryPointsUpdated));
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
                    results = payloadsByFaction.Select(pbf => new { faction = pbf.Key, points = pbf.Last().Points })
                })
            });

            return withSessionSummary;
        }
    }
}
