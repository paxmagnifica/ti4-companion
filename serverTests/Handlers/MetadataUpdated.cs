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
    }
}