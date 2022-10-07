using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Newtonsoft.Json;
using NSubstitute;
using NUnit.Framework;
using server.Domain;
using server.Domain.Exceptions;

namespace serverTests.Handlers
{
    public class MetadataUpdated
    {
        IRepository Repository { get; set; }
        
        public MetadataUpdated()
        {
            Repository = Substitute.For<IRepository>();
        }

        [Test]
        public async Task ShouldCreateEventsCollectionWhenThereIsNone()
        {
            // given
            var sessionId = Guid.NewGuid();
            var session = new Session()
            {
                Id = sessionId,
            };

            Repository.GetByIdWithEvents(sessionId).Returns(session);

            var handler = new server.Domain.MetadataUpdated(Repository);
            
            // when
            await handler.Handle(new GameEvent()
            {
                SessionId = sessionId,
                SerializedPayload = "{\"SessionDisplayName\": \"test\"}"
            });

            // then
            Assert.NotNull(session.Events);
        }

        [Test]
        public async Task ShouldAddReceivedGameEventToEventsCollection()
        {
            // given
            var sessionId = Guid.NewGuid();
            var session = new Session()
            {
                Id = sessionId,
            };

            Repository.GetByIdWithEvents(sessionId).Returns(session);

            var handler = new server.Domain.MetadataUpdated(Repository);

            var givenEvent = new GameEvent()
            {
                SessionId = sessionId,
                SerializedPayload = "{\"SessionDisplayName\":\"test\",\"IsTTS\":false,\"IsSplit\":false,\"SessionStart\":null,\"SessionEnd\":\"\",\"Duration\":0.0,\"VpCount\":10,\"Colors\":{}}"
            };

            // when
            await handler.Handle(givenEvent);

            // then
            var loggedEvent = session.Events[0];
            Assert.That(loggedEvent.Id == givenEvent.Id);
            Assert.That(loggedEvent.SessionId == givenEvent.SessionId);
            Assert.That(loggedEvent.HappenedAt == givenEvent.HappenedAt);
            Assert.That(loggedEvent.EventType == givenEvent.EventType);
            Assert.AreEqual(givenEvent.SerializedPayload, loggedEvent.SerializedPayload);
        }
    }
}