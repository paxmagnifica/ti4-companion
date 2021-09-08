using System;

namespace server.Domain
{
    public class GameEvent
    {
        public Guid Id { get; set; }
        public Guid SessionId { get; set; }
        public DateTimeOffset HappenedAt { get; set; }
        public string EventType { get; set; }
        public string SerializedPayload { get; set; }

        public const string GameStarted = "GameStarted";
    }
}
