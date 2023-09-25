using FluentAssertions;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using NSubstitute;
using NUnit.Framework;
using Server.Domain;
using Server.Domain.Exceptions;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ServerTests.Katowice
{
    public class DraftPick
    {
        public DraftPick()
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
        public async Task ShouldAddCommitDraftEventAfterAllDraftPicks()
        {
            // given
            var sessionWithOneDraftToGo = Data.GetFullyDraftedSession();
            sessionWithOneDraftToGo.Events.RemoveAt(sessionWithOneDraftToGo.Events.Count - 1);

            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(sessionWithOneDraftToGo);

            var draftPickHandler = new Server.Domain.Katowice.DraftPick(this.Repository);
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.DraftPick),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.DraftPickPayload
                {
                    Action = "faction",
                    Choice = "The_Argent_Flight",
                    PlayerIndex = 4,
                }),
            };
            var expectedFactions = new string[] { "The_Barony_of_Letnev", "The_Arborec", "The_Embers_of_Muaat", "The_Yin_Brotherhood", "The_Argent_Flight", "The_L1Z1X_Mindnet" };
            var expectedTablePositions = new int[] { 2, 5, 1, 0, 3, 4 };
            var expectedInitiative = new int[] { 6, 4, 1, 5, 3, 2 };

            // when
            await draftPickHandler.Handle(given);

            // then
            var commitDraftEvent = sessionWithOneDraftToGo.Events.Last();
            commitDraftEvent.EventType.Should().Be(nameof(CommitDraft));
            var payload = CommitDraft.GetPayload(commitDraftEvent);
            payload.Factions.Should().BeEquivalentTo(expectedFactions);
            payload.TablePositions.Should().BeEquivalentTo(expectedTablePositions);
            payload.Initiative.Should().BeEquivalentTo(expectedInitiative);
        }

        [Test]
        public async Task ShouldNotAllowDraftPickEventAfterAllDraftPickEvents()
        {
            // given
            var sessionWithAllDraftDone = Data.GetFullyDraftedSession();

            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(sessionWithAllDraftDone);

            var draftPickHandler = new Server.Domain.Katowice.DraftPick(this.Repository);
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.DraftPick),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.DraftPickPayload
                {
                    Action = "faction",
                    Choice = "The_Argent_Flight",
                    PlayerIndex = 4,
                }),
            };

            // when
            Func<Task> addingTooManyDraftPicks = () => draftPickHandler.Handle(given);

            // then
            await addingTooManyDraftPicks.Should().ThrowAsync<ConflictException>();
        }

        [Test]
        public async Task ShouldNotAllowPlayersTheSamePickTwice_Initiative()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(Data.GetAllPickBans().Item2);
            session.Events.AddRange(Data.GetAllNominations().Item2);
            var eventsThatAllowPlayer2SecondInitiativePick = Data.GetFullDraft().Item2.Take(11);
            session.Events.AddRange(eventsThatAllowPlayer2SecondInitiativePick);

            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var draftPickHandler = new Server.Domain.Katowice.DraftPick(this.Repository);
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.DraftPick),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.DraftPickPayload
                {
                    Action = "initiative",
                    Choice = "2",
                }),
            };

            // when
            Func<Task> pickingInitiativeSecondTimeAsPlayer2 = () => draftPickHandler.Handle(given);

            // then
            await pickingInitiativeSecondTimeAsPlayer2.Should().ThrowAsync<ConflictException>();
        }

        [Test]
        public async Task ShouldNotAllowPlayersTheSamePickTwice_TablePosition()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(Data.GetAllPickBans().Item2);
            session.Events.AddRange(Data.GetAllNominations().Item2);
            var eventsThatAllowPlayer4SecondTablePositionPick = Data.GetFullDraft().Item2.Take(6);
            session.Events.AddRange(eventsThatAllowPlayer4SecondTablePositionPick);

            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var draftPickHandler = new Server.Domain.Katowice.DraftPick(this.Repository);
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.DraftPick),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.DraftPickPayload
                {
                    Action = "tablePosition",
                    Choice = "4",
                }),
            };

            // when
            Func<Task> pickingTablePositionSecondTimeAsPlayer4 = () => draftPickHandler.Handle(given);

            // then
            await pickingTablePositionSecondTimeAsPlayer4.Should().ThrowAsync<ConflictException>();
        }

        [Test]
        public async Task ShouldNotAllowPlayersTheSamePickTwice_Faction()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(Data.GetAllPickBans().Item2);
            session.Events.AddRange(Data.GetAllNominations().Item2);
            var eventsThatAllowPlayer1SecondFactionPick = Data.GetFullDraft().Item2.Take(8);
            session.Events.AddRange(eventsThatAllowPlayer1SecondFactionPick);

            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var draftPickHandler = new Server.Domain.Katowice.DraftPick(this.Repository);
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.DraftPick),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.DraftPickPayload
                {
                    Action = "faction",
                    Choice = "The_Embers_of_Muaat",
                }),
            };

            // when
            Func<Task> pickingFactionSecondTimeAsPlayer1 = () => draftPickHandler.Handle(given);

            // then
            await pickingFactionSecondTimeAsPlayer1.Should().ThrowAsync<ConflictException>();
        }

        [Test]
        public async Task ShouldNotAllowPlayersToPickBannedFaction()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(Data.GetAllPickBans().Item2);
            session.Events.AddRange(Data.GetAllNominations().Item2);

            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var draftPickHandler = new Server.Domain.Katowice.DraftPick(this.Repository);
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.DraftPick),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.DraftPickPayload
                {
                    Action = "faction",
                    Choice = "The_Naalu_Collective",
                }),
            };

            // when
            Func<Task> pickingBannedFaction = () => draftPickHandler.Handle(given);

            // then
            await pickingBannedFaction.Should().ThrowAsync<ConflictException>();
        }

        [Test]
        public async Task ShouldNotAllowPlayersToPickNominatedUnconfirmedFaction()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(Data.GetAllPickBans().Item2);
            session.Events.AddRange(Data.GetAllNominations().Item2);

            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var draftPickHandler = new Server.Domain.Katowice.DraftPick(this.Repository);
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.DraftPick),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.DraftPickPayload
                {
                    Action = "faction",
                    Choice = "The_Federation_of_Sol",
                }),
            };

            // when
            Func<Task> pickingNominatedUnconfirmedFaction = () => draftPickHandler.Handle(given);

            // then
            await pickingNominatedUnconfirmedFaction.Should().ThrowAsync<ConflictException>();
        }

        [Test]
        public async Task ShouldNotAllowPlayersToPickIgnoredFaction()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(Data.GetAllPickBans().Item2);
            session.Events.AddRange(Data.GetAllNominations().Item2);

            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var draftPickHandler = new Server.Domain.Katowice.DraftPick(this.Repository);
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.DraftPick),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.DraftPickPayload
                {
                    Action = "faction",
                    Choice = "The_VuilRaith_Cabal",
                }),
            };

            // when
            Func<Task> pickingFactionThatNobodyCaredAbout = () => draftPickHandler.Handle(given);

            // then
            await pickingFactionThatNobodyCaredAbout.Should().ThrowAsync<ConflictException>();
        }

        [Test]
        public async Task ShouldNotAllowPlayersToPickFactionAlreadyPickedByAnotherPlayer()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(Data.GetAllPickBans().Item2);
            session.Events.AddRange(Data.GetAllNominations().Item2);
            session.Events.Add(new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.DraftPick),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.DraftPickPayload
                {
                    Action = "faction",
                    Choice = "The_Arborec",
                }),
            });

            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var draftPickHandler = new Server.Domain.Katowice.DraftPick(this.Repository);
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.DraftPick),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.DraftPickPayload
                {
                    Action = "faction",
                    Choice = "The_Arborec",
                }),
            };

            // when
            Func<Task> pickingFactionSomebodyAlreadyPicked = () => draftPickHandler.Handle(given);

            // then
            await pickingFactionSomebodyAlreadyPicked.Should().ThrowAsync<ConflictException>();
        }

        [Test]
        public async Task ShouldNotAllowPlayersToPickInitiativeAlreadyPicked()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(Data.GetAllPickBans().Item2);
            session.Events.AddRange(Data.GetAllNominations().Item2);
            session.Events.Add(new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.DraftPick),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.DraftPickPayload
                {
                    Action = "initiative",
                    Choice = "1",
                }),
            });

            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var draftPickHandler = new Server.Domain.Katowice.DraftPick(this.Repository);
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.DraftPick),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.DraftPickPayload
                {
                    Action = "initiative",
                    Choice = "1",
                }),
            };

            // when
            Func<Task> pickingTheSameInitiativeAsSomebodyElse = () => draftPickHandler.Handle(given);

            // then
            await pickingTheSameInitiativeAsSomebodyElse.Should().ThrowAsync<ConflictException>();
        }

        [Test]
        public async Task ShouldNotAllowPlayersToPickTablePositionAlreadyPicked()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(Data.GetAllPickBans().Item2);
            session.Events.AddRange(Data.GetAllNominations().Item2);
            session.Events.Add(new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.DraftPick),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.DraftPickPayload
                {
                    Action = "tablePosition",
                    Choice = "1",
                }),
            });

            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var draftPickHandler = new Server.Domain.Katowice.DraftPick(this.Repository);
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.DraftPick),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.DraftPickPayload
                {
                    Action = "tablePosition",
                    Choice = "1",
                }),
            };

            // when
            Func<Task> pickingTheSameTablePositionAsSomebodyElse = () => draftPickHandler.Handle(given);

            // then
            await pickingTheSameTablePositionAsSomebodyElse.Should().ThrowAsync<ConflictException>();
        }
    }
}
