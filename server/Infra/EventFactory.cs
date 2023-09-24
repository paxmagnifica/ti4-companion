using Server.Domain;
using Server.Extensions;
using System;
using System.Threading.Tasks;

namespace Server.Infra
{
    public class EventFactory
    {
        private readonly ITimeProvider timeProvider;
        private readonly IRepository repository;

        public EventFactory(ITimeProvider timeProvider, IRepository repository)
        {
            this.timeProvider = timeProvider;
            this.repository = repository;
        }

        public async Task<bool> CanEventBeAdded(Guid sessionId, EventDto eventDto)
        {
            var sessionChecksum = await this.repository.GetSessionChecksum(sessionId);

            return sessionChecksum == eventDto.Checksum;
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
