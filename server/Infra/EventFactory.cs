using System;
using server.Domain;
using server.Extensions;

namespace server.Infra
{
    public class EventFactory
    {
        private readonly ITimeProvider _timeProvider;

        public EventFactory(ITimeProvider timeProvider)
        {
            _timeProvider = timeProvider;
        }

        public GameEvent GetGameEvent(Guid sessionId, EventDto eventDto)
        {
            var gameEvent = new GameEvent();
            gameEvent.HappenedAt = _timeProvider.Now;
            gameEvent.SessionId = sessionId;
            gameEvent.EventType = eventDto.EventType.Capitalize();
            gameEvent.SerializedPayload = eventDto.SerializedPayload;

            return gameEvent;
        }
    }
}
