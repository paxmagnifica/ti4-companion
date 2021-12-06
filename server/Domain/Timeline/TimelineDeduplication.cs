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
            var deduplicated = new List<TimelineEvent>();

            var faction = "";
            var factionVPHistory = new Dictionary<string, List<int>>();

            foreach (var timelineEvent in possiblyDuplicatedEvents)
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

                if (previousFaction != faction) {
                    deduplicated.Add(timelineEvent);
                    continue;
                }

                var secondToLast = factionVPHistory[payload.Faction][factionVPHistory[payload.Faction].Count - 2];
                if (payload.Points != secondToLast) {
                    deduplicated.Add(timelineEvent);
                    continue;
                }

                deduplicated.RemoveAt(deduplicated.Count - 1);
            }

            return deduplicated;
        }
    }
}
