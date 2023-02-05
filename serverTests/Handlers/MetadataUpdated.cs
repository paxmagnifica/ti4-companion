using NSubstitute;
using NUnit.Framework;
using Server.Domain;
using Server.Domain.Exceptions;
using System;
using System.Threading.Tasks;

namespace ServerTests.Handlers
{
    public class MetadataUpdated
    {
        public MetadataUpdated()
        {
            this.Repository = Substitute.For<IRepository>();
        }

        private IRepository Repository { get; set; }

        [Test]
        public async Task ShouldCreateEventsCollectionWhenThereIsNone()
        {
            // given
            var sessionId = Guid.NewGuid();
            var session = new Session()
            {
                Id = sessionId,
            };

            this.Repository.GetByIdWithEvents(sessionId).Returns(session);

            var handler = new Server.Domain.MetadataUpdated(this.Repository);

            // when
            await handler.Handle(new GameEvent()
            {
                SessionId = sessionId,
                SerializedPayload = "{\"SessionDisplayName\": \"test\",\"VpCount\":11}",
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

            this.Repository.GetByIdWithEvents(sessionId).Returns(session);

            var handler = new Server.Domain.MetadataUpdated(this.Repository);

            var givenEvent = new GameEvent()
            {
                SessionId = sessionId,
                SerializedPayload = "{\"SessionDisplayName\":\"test\",\"IsTTS\":false,\"IsSplit\":false,\"SessionStart\":null,\"SessionEnd\":\"\",\"Duration\":0.0,\"VpCount\":11,\"Colors\":{},\"MapPositions\":[]}",
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

        [TestCase(
            "{\"SessionDisplayName\":\"test\",\"IsTTS\":false,\"IsSplit\":false,\"SessionStart\":null,\"SessionEnd\":\"\",\"Duration\":0.0,\"VpCount\":11,\"Colors\":{}}",
            TestName = "ShouldRewriteFieldsWhenAllGiven",
            ExpectedResult = "{\"SessionDisplayName\":\"test\",\"IsTTS\":false,\"IsSplit\":false,\"SessionStart\":null,\"SessionEnd\":\"\",\"Duration\":0.0,\"VpCount\":11,\"Colors\":{},\"MapPositions\":[]}")]
        [TestCase(
            "{\"SessionDisplayName\":\"test\",\"IsTTS\":false,\"IsSplit\":false,\"SessionStart\":null,\"SessionEnd\":\"2022-12-06\",\"Duration\":0.0,\"VpCount\":11,\"Colors\":{}}",
            TestName = "ShouldSetEmptySessionEndWhenThisIsNotSplitSession",
            ExpectedResult = "{\"SessionDisplayName\":\"test\",\"IsTTS\":false,\"IsSplit\":false,\"SessionStart\":null,\"SessionEnd\":\"\",\"Duration\":0.0,\"VpCount\":11,\"Colors\":{},\"MapPositions\":[]}")]
        [TestCase(
            "{\"SessionDisplayName\":\"test\",\"IsTTS\":false,\"IsSplit\":true,\"SessionStart\":null,\"SessionEnd\":\"2022-12-06\",\"Duration\":0.0,\"VpCount\":11,\"Colors\":{}}",
            TestName = "ShouldUseGivenSessionEndWhenSplitSessionGiven",
            ExpectedResult = "{\"SessionDisplayName\":\"test\",\"IsTTS\":false,\"IsSplit\":true,\"SessionStart\":null,\"SessionEnd\":\"2022-12-06\",\"Duration\":0.0,\"VpCount\":11,\"Colors\":{},\"MapPositions\":[]}")]
        [TestCase(
            "{\"SessionDisplayName\":\"test\",\"IsTTS\":false,\"IsSplit\":true,\"SessionStart\":null,\"SessionEnd\":\"2022-12-06\",\"Duration\":0.0,\"VpCount\":11,\"Colors\":{}}",
            TestName = "ShouldReturnGivenVpCountWhenPositiveVpCountGiven",
            ExpectedResult = "{\"SessionDisplayName\":\"test\",\"IsTTS\":false,\"IsSplit\":true,\"SessionStart\":null,\"SessionEnd\":\"2022-12-06\",\"Duration\":0.0,\"VpCount\":11,\"Colors\":{},\"MapPositions\":[]}")]
        public async Task<string> ShouldSanitizeReceivedGameEventBeforeAddingToEventsCollection(string givenPayload)
        {
            // given
            var sessionId = Guid.NewGuid();
            var session = new Session()
            {
                Id = sessionId,
            };

            this.Repository.GetByIdWithEvents(sessionId).Returns(session);

            var handler = new Server.Domain.MetadataUpdated(this.Repository);

            var givenEvent = new GameEvent()
            {
                SessionId = sessionId,
                SerializedPayload = givenPayload,
            };

            // when
            await handler.Handle(givenEvent);

            // then
            var loggedEvent = session.Events[0];
            return loggedEvent.SerializedPayload;
        }

        [TestCase(
            "{\"SessionDisplayName\":\"test\",\"IsTTS\":false,\"IsSplit\":true,\"SessionStart\":\"2022-12-05\",\"SessionEnd\":\"2022-12-06\",\"Duration\":0.0,\"VpCount\":9,\"Colors\":{}}",
            TestName = "VpCountBelow10",
            ExpectedResult = "Metadata payload invalid: VP count below 10")]
        [TestCase(
            "{\"SessionDisplayName\":\"test\",\"IsTTS\":false,\"IsSplit\":true,\"SessionStart\":\"2022-12-05\",\"SessionEnd\":\"2022-12-06\",\"Duration\":0.0,\"VpCount\":15,\"Colors\":{}}",
            TestName = "VpCountAbove14",
            ExpectedResult = "Metadata payload invalid: VP count above 14")]
        [TestCase(
            "{\"SessionDisplayName\":\"test\",\"IsTTS\":false,\"IsSplit\":true,\"SessionStart\":\"2022-12-15\",\"SessionEnd\":\"2022-12-06\",\"Duration\":0.0,\"VpCount\":12,\"Colors\":{}}",
            TestName = "SessionStartAfterSessionEnd",
            ExpectedResult = "Metadata payload invalid: End should occur after start")]
        [TestCase(
            "{\"SessionDisplayName\":\"test\",\"IsTTS\":false,\"IsSplit\":true,\"SessionStart\":\"2022-15-12\",\"SessionEnd\":\"2022-12-06\",\"Duration\":0.0,\"VpCount\":12,\"Colors\":{}}",
            TestName = "InvalidSessionStartFormat",
            ExpectedResult = "Metadata payload invalid: Invalid session start format")]
        [TestCase(
            "{\"SessionDisplayName\":\"test\",\"IsTTS\":false,\"IsSplit\":true,\"SessionStart\":\"2022-12-12\",\"SessionEnd\":\"2022-13-06\",\"Duration\":0.0,\"VpCount\":12,\"Colors\":{}}",
            TestName = "InvalidSessionStartFormat",
            ExpectedResult = "Metadata payload invalid: Invalid session end format")]
        public string ShouldNotAllowMetadataUpdateWhenPayloadInvalid(string invalidPayload)
        {
            // given
            var sessionId = Guid.NewGuid();
            var givenEvent = new GameEvent
            {
                SessionId = sessionId,
                SerializedPayload = invalidPayload,
            };

            var session = new Session()
            {
                Id = sessionId,
            };

            this.Repository.GetByIdWithEvents(sessionId).Returns(session);

            var handler = new Server.Domain.MetadataUpdated(this.Repository);

            // when & then
            var exception = Assert.ThrowsAsync<MetadataUpdatedPayloadInvalidException>(async () => await handler.Handle(givenEvent));
            return exception.Message;
        }
    }
}
