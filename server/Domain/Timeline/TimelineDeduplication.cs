using System.Collections.Generic;
using System.Linq;

namespace server.Domain
{
    public interface ITimelineDeduplication
    {
        IEnumerable<TimelineEvent> Deduplicate(IEnumerable<TimelineEvent> possiblyDuplicatedEvents);
    }

    public class TimelineDeduplication : ITimelineDeduplication
    {
        public IEnumerable<TimelineEvent> Deduplicate(IEnumerable<TimelineEvent> possiblyDuplicatedEvents)
        {
            var deduplicatedVpScored = DeduplicateVp(possiblyDuplicatedEvents);
            var deduplicatedObjectives = DeduplicateObjectives(deduplicatedVpScored);

            return deduplicatedObjectives.Select((ded, index) =>
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
    }
}
