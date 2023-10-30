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
    public class ObjectiveDescored
    {
        public ObjectiveDescored()
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

            var handler = new Server.Domain.ObjectiveDescored(this.Repository, this.TimeProvider);
            var objectiveDescoredPayload = new ObjectiveDescoredPayload
            {
                Faction = "some_faction",
                Slug = "some_objective",
                Points = 3,
            };
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.ObjectiveDescored),
                SerializedPayload = JsonConvert.SerializeObject(objectiveDescoredPayload),
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

            var handler = new Server.Domain.ObjectiveDescored(this.Repository, this.TimeProvider);
            var ObjectiveDescoredPayload = new ObjectiveDescoredPayload
            {
                Faction = "some_faction",
                Slug = "some_objective",
                Points = 3,
            };
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.ObjectiveDescored),
                SerializedPayload = JsonConvert.SerializeObject(ObjectiveDescoredPayload),
            };

            // when
            await handler.Handle(given);

            // then
            var victoryPointsEvent = session.Events.First(e => e.EventType == nameof(VictoryPointsUpdated));
            victoryPointsEvent.HappenedAt.Should().Be(expectedTime);

            var actualPayload = VictoryPointsUpdated.GetPayload(victoryPointsEvent);

            actualPayload.Faction.Should().Be("some_faction");
            actualPayload.Points.Should().Be(3);
        }
    }
}
