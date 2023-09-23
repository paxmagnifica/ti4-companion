using FluentAssertions;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using NSubstitute;
using NUnit.Framework;
using Server.Controllers;
using Server.Domain;
using Server.Infra;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ServerTests
{
    public class DataIntegrity
    {
        private JsonSerializerSettings SerializerSettings
        {
            get
            {
                var serializerSettings = new JsonSerializerSettings();
                serializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                return serializerSettings;
            }
        }

        public DataIntegrity()
        {
            this.Repository = Substitute.For<IRepository>();
            this.TimeProvider = Substitute.For<ITimeProvider>();
        }

        private IRepository Repository { get; set; }

        private ITimeProvider TimeProvider { get; set; }

        [Test]
        public void ShouldIncludeLastEventIdAsChecksumInSessionDto()
        {
            // given
            var expectedGuid = Guid.NewGuid();
            var given = new List<GameEvent>()
            {
                new GameEvent
                {
                    Id = Guid.NewGuid(),
                    EventType = nameof(CommitDraft),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new CommitDraftPayload
                    {
                        Factions = new string[] { "The_Nekro_Virus", "Sardakk_Norr", "The_Winnu", "The_Xxcha_Kingdom" },
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    Id = Guid.NewGuid(),
                    EventType = nameof(GameStarted),
                    SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload
                    {
                        Options = new DraftOptions
                        {
                            InitialPool = new string[] { "The_Nekro_Virus", "Sardakk_Norr", "The_Winnu", "The_Xxcha_Kingdom" },
                            Players = new string[] { "Player 1", "Player 2" },
                        },
                    }),
                },
                new GameEvent
                {
                    Id = Guid.NewGuid(),
                    EventType = nameof(MetadataUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(new MetadataUpdatedPayload
                    {
                        VpCount = 12,
                    }),
                },
                new GameEvent
                {
                    Id = Guid.NewGuid(),
                    EventType = nameof(ObjectiveAdded),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new ObjectiveAddedPayload
                    {
                            Slug = "raise-a-fleet",
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    Id = expectedGuid,
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Xxcha_Kingdom",
                            Points = 1,
                    }, this.SerializerSettings),
                },
            };

            // when
            var sessionDto = new SessionDto(new Session { Events = given });

            // then
            sessionDto.Checksum.Should().Be(expectedGuid);
        }

        [Test]
        public async Task ShouldNotAllowAddingEventWithStaleStateChecksum()
        {
            // given
            var sessionId = Guid.NewGuid();
            var sessionChecksum = Guid.NewGuid();
            var eventFactory = new EventFactory(this.TimeProvider, this.Repository);
            var eventDto = new EventDto{
                Checksum = Guid.NewGuid(),
            };

            this.Repository.GetSessionChecksum(sessionId).Returns(sessionChecksum);

            // when
            var allowEvent = await eventFactory.CanEventBeAdded(sessionId, eventDto);

            // then
            allowEvent.Should().Be(false);
        }

        [Test]
        public async Task ShouldNotAllowAddingEventWithoutChecksum()
        {
            // given
            var sessionId = Guid.NewGuid();
            var eventFactory = new EventFactory(this.TimeProvider, this.Repository);
            var eventDto = new EventDto{ };

            this.Repository.GetSessionChecksum(sessionId).Returns(Guid.NewGuid());

            // when
            var allowEvent = await eventFactory.CanEventBeAdded(sessionId, eventDto);

            // then
            allowEvent.Should().Be(false);
        }

        [Test]
        public async Task ShouldAllowAddingEventWithChecksumMatchingSession()
        {
            // given
            var sessionId = Guid.NewGuid();
            var sessionChecksum = Guid.NewGuid();
            var eventFactory = new EventFactory(this.TimeProvider, this.Repository);
            var eventDto = new EventDto{
                Checksum = sessionChecksum,
            };

            this.Repository.GetSessionChecksum(sessionId).Returns(sessionChecksum);

            // when
            var allowEvent = await eventFactory.CanEventBeAdded(sessionId, eventDto);

            // then
            allowEvent.Should().Be(true);
        }
    }
}
