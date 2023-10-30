using FluentAssertions;
using Newtonsoft.Json;
using NSubstitute;
using NUnit.Framework;
using Server.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ServerTests.Handlers
{
    public class ObjectiveScored
    {
        public ObjectiveScored()
        {
            this.Repository = Substitute.For<IRepository>();
            this.TimeProvider = Substitute.For<ITimeProvider>();
        }

        private IRepository Repository { get; set; }

        private ITimeProvider TimeProvider { get; set; }

        [Test]
        public async Task ShouldAddTheEventToSession()
        {
            // given
            var session = new Session
            {
                Id = Guid.NewGuid(),
                Events = new List<GameEvent>(),
            };
            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var handler = new Server.Domain.ObjectiveScored(this.Repository, this.TimeProvider);
            var objectiveScoredPayload = new ObjectiveScoredPayload
            {
                Faction = "some_faction",
                Slug = "some_objective",
                Points = 3,
            };
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.ObjectiveScored),
                SerializedPayload = JsonConvert.SerializeObject(objectiveScoredPayload),
            };

            // when
            await handler.Handle(given);

            // then
            session.Events.Last().Should().Be(given);
        }

        [Test]
        public async Task ShouldGenerateVictoryPointsEvent()
        {
            // given
            var session = new Session
            {
                Id = Guid.NewGuid(),
                Events = new List<GameEvent>(),
            };
            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var expectedTime = DateTimeOffset.Now;
            this.TimeProvider.Now.Returns(expectedTime);

            var handler = new Server.Domain.ObjectiveScored(this.Repository, this.TimeProvider);
            var objectiveScoredPayload = new ObjectiveScoredPayload
            {
                Faction = "some_faction",
                Slug = "some_objective",
                Points = 3,
            };
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.ObjectiveScored),
                SerializedPayload = JsonConvert.SerializeObject(objectiveScoredPayload),
            };

            // when
            await handler.Handle(given);

            // then
            var victoryPointsEvent = session.Events.First(e => e.EventType == nameof(VictoryPointsUpdated));
            victoryPointsEvent.HappenedAt.Should().Be(expectedTime);

            var actualPayload = VictoryPointsUpdated.GetPayload(victoryPointsEvent);

            actualPayload.Faction.Should().Be("some_faction");
            actualPayload.Points.Should().Be(3);
            actualPayload.Source.Should().Be(VictoryPointSource.Objective);
            actualPayload.Context.Should().Be("some_objective");
        }
    }
}
