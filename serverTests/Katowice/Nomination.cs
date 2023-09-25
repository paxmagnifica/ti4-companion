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
    public class Nomination
    {
        public Nomination()
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
        public async Task ShouldNotAllowNominatingAlreadyNominatedFaction()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(Data.GetAllPickBans().Item2);
            session.Events.Add(new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.Nomination),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.NominationPayload
                {
                    Action = "nominate",
                    Faction = "The_Argent_Flight",
                }),
            });

            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var nomination = new Server.Domain.Katowice.Nomination(this.Repository);
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.Nomination),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.NominationPayload
                {
                    Action = "nominate",
                    Faction = "The_Argent_Flight",
                }),
            };

            // when
            Func<Task> act = () => nomination.Handle(given);

            // then
            await act.Should().ThrowAsync<ConflictException>();
        }

        [Test]
        public async Task ShouldAllowConfirmingPreviouslyNominatedFAction()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(Data.GetAllPickBans().Item2);
            session.Events.Add(new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.Nomination),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.NominationPayload
                {
                    Action = "nominate",
                    Faction = "The_Argent_Flight",
                }),
            });

            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var nomination = new Server.Domain.Katowice.Nomination(this.Repository);
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.Nomination),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.NominationPayload
                {
                    Action = "confirm",
                    Faction = "The_Argent_Flight",
                }),
            };

            // when
            await nomination.Handle(given);

            // then
            session.Events.Last().Should().Be(given);
        }

        [Test]
        public async Task ShouldNotAllowConfirmingPreviouslyConfirmedFaction()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(Data.GetAllPickBans().Item2);
            session.Events.Add(new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.Nomination),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.NominationPayload
                {
                    Action = "nominate",
                    Faction = "The_Argent_Flight",
                }),
            });
            session.Events.Add(new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.Nomination),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.NominationPayload
                {
                    Action = "confirm",
                    Faction = "The_Argent_Flight",
                }),
            });

            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var nomination = new Server.Domain.Katowice.Nomination(this.Repository);
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.Nomination),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.NominationPayload
                {
                    Action = "confirm",
                    Faction = "The_Argent_Flight",
                }),
            };

            // when
            Func<Task> act = () => nomination.Handle(given);

            // then
            await act.Should().ThrowAsync<ConflictException>();
        }

        [Test]
        public async Task ShouldNotAllowConfirmingFactionThatWasNotNominated()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(Data.GetAllPickBans().Item2);
            session.Events.Add(new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.Nomination),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.NominationPayload
                {
                    Action = "nominate",
                    Faction = "The_Argent_Flight",
                }),
            });
            session.Events.Add(new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.Nomination),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.NominationPayload
                {
                    Action = "confirm",
                    Faction = "The_Argent_Flight",
                }),
            });

            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var nomination = new Server.Domain.Katowice.Nomination(this.Repository);
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.Nomination),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.NominationPayload
                {
                    Action = "confirm",
                    Faction = "The_Arborec",
                }),
            };

            // when
            Func<Task> act = () => nomination.Handle(given);

            // then
            await act.Should().ThrowAsync<ConflictException>();
        }

        [Test]
        public async Task ShouldNotAllowConfirmingOrNominatingAfterAllNominationsConfirmationsAreDone()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(Data.GetAllPickBans().Item2);
            session.Events.AddRange(Data.GetAllNominations().Item2);

            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var nomination = new Server.Domain.Katowice.Nomination(this.Repository);
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.Nomination),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.NominationPayload
                {
                    Action = "confirm",
                    Faction = "The_Federation_of_Sol",
                }),
            };

            // when
            Func<Task> act = () => nomination.Handle(given);

            // then
            await act.Should().ThrowAsync<ConflictException>();
        }

        [Test]
        public async Task ShouldNotAllowNominatingBannedFaction()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(Data.GetAllPickBans().Item2);

            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var nomination = new Server.Domain.Katowice.Nomination(this.Repository);
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.Nomination),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.NominationPayload
                {
                    Action = "nominate",
                    Faction = "The_Naalu_Collective",
                }),
            };

            // when
            Func<Task> act = () => nomination.Handle(given);

            // then
            await act.Should().ThrowAsync<ConflictException>();
        }

        [Test]
        public async Task ShouldNotAllowNominatingPickedFaction()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(Data.GetAllPickBans().Item2);

            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var nomination = new Server.Domain.Katowice.Nomination(this.Repository);
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.Nomination),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.NominationPayload
                {
                    Action = "nominate",
                    Faction = "The_Arborec",
                }),
            };

            // when
            Func<Task> act = () => nomination.Handle(given);

            // then
            await act.Should().ThrowAsync<ConflictException>();
        }
    }
}
