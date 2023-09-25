using FluentAssertions;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using NSubstitute;
using NUnit.Framework;
using Server.Domain;
using Server.Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ServerTests.Katowice
{
    public class PickBan
    {
        public PickBan()
        {
            this.Repository = Substitute.For<IRepository>();
        }

        private JsonSerializerSettings SerializerSettings
        {
            get
            {
                var serializerSettings = new JsonSerializerSettings();
                serializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                return serializerSettings;
            }
        }

        private IRepository Repository { get; set; }

        [Test]
        public async Task ShouldNotAllowPickingAlreadyBannedFaction()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(new List<GameEvent>
            {
                new GameEvent
                {
                    EventType = nameof(Server.Domain.Katowice.PickBan),
                    SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.PickBanPayload
                    {
                        Action = "ban",
                        Faction = "The_Argent_Flight",
                    }),
                },
            });

            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var pickBan = new Server.Domain.Katowice.PickBan(this.Repository);
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.PickBan),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.PickBanPayload
                {
                    Action = "pick",
                    Faction = "The_Argent_Flight",
                }),
            };

            // when
            Func<Task> act = () => pickBan.Handle(given);

            // then
            await act.Should().ThrowAsync<ConflictException>();
        }

        [Test]
        public async Task ShouldNotAllowPickingAlreadyPickedFaction()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(new List<GameEvent>
            {
                new GameEvent
                {
                    EventType = nameof(Server.Domain.Katowice.PickBan),
                    SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.PickBanPayload
                    {
                        Action = "pick",
                        Faction = "The_Argent_Flight",
                    }),
                },
            });

            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var pickBan = new Server.Domain.Katowice.PickBan(this.Repository);
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.PickBan),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.PickBanPayload
                {
                    Action = "pick",
                    Faction = "The_Argent_Flight",
                }),
            };

            // when
            Func<Task> act = () => pickBan.Handle(given);

            // then
            await act.Should().ThrowAsync<ConflictException>();
        }

        [Test]
        public async Task ShouldNotAllowBanningAlreadyBannedFaction()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(new List<GameEvent>
            {
                new GameEvent
                {
                    EventType = nameof(Server.Domain.Katowice.PickBan),
                    SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.PickBanPayload
                    {
                        Action = "ban",
                        Faction = "The_Argent_Flight",
                    }),
                },
            });

            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var pickBan = new Server.Domain.Katowice.PickBan(this.Repository);
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.PickBan),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.PickBanPayload
                {
                    Action = "ban",
                    Faction = "The_Argent_Flight",
                }),
            };

            // when
            Func<Task> act = () => pickBan.Handle(given);

            // then
            await act.Should().ThrowAsync<ConflictException>();
        }

        [Test]
        public async Task ShouldNotAllowBanningAlreadyPickedFaction()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(new List<GameEvent>
            {
                new GameEvent
                {
                    EventType = nameof(Server.Domain.Katowice.PickBan),
                    SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.PickBanPayload
                    {
                        Action = "pick",
                        Faction = "The_Argent_Flight",
                    }),
                },
            });

            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var pickBan = new Server.Domain.Katowice.PickBan(this.Repository);
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.PickBan),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.PickBanPayload
                {
                    Action = "ban",
                    Faction = "The_Argent_Flight",
                }),
            };

            // when
            Func<Task> act = () => pickBan.Handle(given);

            // then
            await act.Should().ThrowAsync<ConflictException>();
        }
    }
}
