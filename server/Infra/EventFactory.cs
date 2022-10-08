
using server.Domain;
using server.Extensions;
using System;

namespace Server.Infra
{
    public class EventFactory
    {
        private readonly ITimeProvider timeProvider;

        public EventFactory(ITimeProvider timeProvider)
        {
            this.timeProvider = timeProvider;
        }

        public GameEvent GetGameEvent(Guid sessionId, EventDto eventDto)
        {
            var gameEvent = new GameEvent();
            gameEvent.HappenedAt = this.timeProvider.Now;
            gameEvent.SessionId = sessionId;
            gameEvent.EventType = eventDto.EventType.Capitalize();
            gameEvent.SerializedPayload = eventDto.SerializedPayload;

            return gameEvent;
        }
    }
}
