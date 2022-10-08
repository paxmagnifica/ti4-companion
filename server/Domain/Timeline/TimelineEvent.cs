using System;

namespace Server.Domain
{
    public class TimelineEvent
    {
        public int Order { get; set; }

        public string EventType { get; set; }

        public string SerializedPayload { get; set; }

        public int FromPoints { get; set; }

        public DateTimeOffset HappenedAt { get; set; }
    }
}
