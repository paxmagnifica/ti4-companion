using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace server.Domain
{
    public interface ITimelineModifiers
    {
        IEnumerable<TimelineEvent> Deduplicate(IEnumerable<TimelineEvent> possiblyDuplicatedEvents);
        IEnumerable<TimelineEvent> AddDraftSummary(IEnumerable<TimelineEvent> timelineEvents);
        IEnumerable<TimelineEvent> AddSessionSummary(IEnumerable<TimelineEvent> timelineEvents);
    }

    public class TimelineModifiers : ITimelineModifiers
    {
        public IEnumerable<TimelineEvent> Deduplicate(IEnumerable<TimelineEvent> possiblyDuplicatedEvents)
        {
            var deduplicatedVpScored = DeduplicateVp(possiblyDuplicatedEvents);
            var deduplicatedObjectives = DeduplicateObjectives(deduplicatedVpScored);

            return RegenerateOrder(deduplicatedObjectives);
        }

        private IEnumerable<TimelineEvent> RegenerateOrder(IEnumerable<TimelineEvent> events)
        {
            return events.Select((ded, index) =>
            {
                ded.Order = index;
                return ded;
            });
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

        public IEnumerable<TimelineEvent> AddDraftSummary(IEnumerable<TimelineEvent> timelineEvents)
        {
            var commitDraftEvent = timelineEvents.FirstOrDefault(e => e.EventType == nameof(CommitDraft));
            if (commitDraftEvent == null)
            {
                return timelineEvents;
            }

            var speakerEvent = timelineEvents.First(e => e.EventType == nameof(SpeakerSelected));
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

            var commitDraftIndex = timelineEvents.ToList().FindIndex(e => e.EventType == nameof(CommitDraft));
            var draftSummary = new TimelineEvent
            {
                EventType = "DraftSummary",
                HappenedAt = commitDraftEvent.HappenedAt,
                SerializedPayload = JsonConvert.SerializeObject(new
                {
                    speaker = SpeakerSelected.GetPayload(speakerEvent.SerializedPayload).SpeakerName,
                    picks = playerPicks.Select(kvp => new { playerName = kvp.Key, faction = kvp.Value.Item1, tablePosition = kvp.Value.Item2 })
                })
            };
            var timelineEventsWithDraftSummary = new List<TimelineEvent>(timelineEvents);
            timelineEventsWithDraftSummary.Insert(commitDraftIndex + 1, draftSummary);

            return RegenerateOrder(timelineEventsWithDraftSummary);
        }

        public IEnumerable<TimelineEvent> AddSessionSummary(IEnumerable<TimelineEvent> timelineEvents)
        {
            var orderedEvents = timelineEvents.OrderBy(e => e.Order);
            var targetVP = orderedEvents.LastOrDefault(e => e.EventType == nameof(MetadataUpdated));

            var targetVPCount = targetVP == null
                ? 10
                : MetadataUpdated.GetPayload(targetVP.SerializedPayload).VpCount;

            var firstToScoreTargetVPCount = timelineEvents.OrderBy(te => te.Order).FirstOrDefault(e => e.EventType == nameof(VictoryPointsUpdated) && e.SerializedPayload.Contains($"\"points\":{targetVPCount}"));

            if (firstToScoreTargetVPCount == null)
            {
                return timelineEvents;
            }

            var victoryPointsEvents = timelineEvents.Where(e => e.EventType == nameof(VictoryPointsUpdated)).OrderBy(e => e.Order);
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

            return RegenerateOrder(withSessionSummary);
        }
    }
}
