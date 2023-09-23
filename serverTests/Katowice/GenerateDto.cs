using FluentAssertions;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using NUnit.Framework;
using Server.Controllers;
using Server.Domain;
using System.Collections.Generic;
using KTW = Server.Domain.Katowice;

namespace ServerTests.Katowice
{
    public class GenerateDto
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

        [Test]
        public void ShouldBeInEmptyBanPickPhaseAfterGameStart()
        {
            // given
            var session = Data.GetEmptySession();

            var expectedPickBan = new KTW.PickBanDto[]
            {
                new KTW.PickBanDto { Player = "Player 2", PlayerIndex = 2, Action = "ban", Choice = null },
                new KTW.PickBanDto { Player = "Player 5", PlayerIndex = 5, Action = "pick", Choice = null },
                new KTW.PickBanDto { Player = "Player 3", PlayerIndex = 3, Action = "ban", Choice = null },
                new KTW.PickBanDto { Player = "Player 1", PlayerIndex = 1, Action = "pick", Choice = null },
                new KTW.PickBanDto { Player = "Player 0", PlayerIndex = 0, Action = "ban", Choice = null },
                new KTW.PickBanDto { Player = "Player 4", PlayerIndex = 4, Action = "pick", Choice = null },
                new KTW.PickBanDto { Player = "Player 4", PlayerIndex = 4, Action = "ban", Choice = null },
                new KTW.PickBanDto { Player = "Player 0", PlayerIndex = 0, Action = "pick", Choice = null },
                new KTW.PickBanDto { Player = "Player 1", PlayerIndex = 1, Action = "ban", Choice = null },
                new KTW.PickBanDto { Player = "Player 3", PlayerIndex = 3, Action = "pick", Choice = null },
                new KTW.PickBanDto { Player = "Player 5", PlayerIndex = 5, Action = "ban", Choice = null },
                new KTW.PickBanDto { Player = "Player 2", PlayerIndex = 2, Action = "pick", Choice = null },
            };

            // when
            var actual = KTW.Draft.GetDto(session);

            // then
            actual.Phase.Should().Be("pickBan");
            actual.InitialPool.Should().BeEquivalentTo(Data.GetInitialPool());
            actual.PickBans.Should().BeEquivalentTo(expectedPickBan);
        }

        [Test]
        public void ShouldIncludePlayerChoicesInPickBans()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(new List<GameEvent>
            {
                new GameEvent
                {
                EventType = nameof(KTW.PickBan),
                SerializedPayload = JsonConvert.SerializeObject(new KTW.PickBanPayload
                    {
                        PlayerIndex = 2,
                        Action = "ban",
                        Faction = "The_Naalu_Collective",
                    }),
                },
                new GameEvent
                {
                EventType = nameof(KTW.PickBan),
                SerializedPayload = JsonConvert.SerializeObject(new KTW.PickBanPayload
                    {
                        PlayerIndex = 5,
                        Action = "pick",
                        Faction = "The_Arborec",
                    }),
                },
            });

            var expectedPickBan = new KTW.PickBanDto[]
            {
                new KTW.PickBanDto { Player = "Player 2", PlayerIndex = 2, Action = "ban", Choice = "The_Naalu_Collective" },
                new KTW.PickBanDto { Player = "Player 5", PlayerIndex = 5, Action = "pick", Choice = "The_Arborec" },
                new KTW.PickBanDto { Player = "Player 3", PlayerIndex = 3, Action = "ban", Choice = null },
                new KTW.PickBanDto { Player = "Player 1", PlayerIndex = 1, Action = "pick", Choice = null },
                new KTW.PickBanDto { Player = "Player 0", PlayerIndex = 0, Action = "ban", Choice = null },
                new KTW.PickBanDto { Player = "Player 4", PlayerIndex = 4, Action = "pick", Choice = null },
                new KTW.PickBanDto { Player = "Player 4", PlayerIndex = 4, Action = "ban", Choice = null },
                new KTW.PickBanDto { Player = "Player 0", PlayerIndex = 0, Action = "pick", Choice = null },
                new KTW.PickBanDto { Player = "Player 1", PlayerIndex = 1, Action = "ban", Choice = null },
                new KTW.PickBanDto { Player = "Player 3", PlayerIndex = 3, Action = "pick", Choice = null },
                new KTW.PickBanDto { Player = "Player 5", PlayerIndex = 5, Action = "ban", Choice = null },
                new KTW.PickBanDto { Player = "Player 2", PlayerIndex = 2, Action = "pick", Choice = null },
            };

            // when
            var actual = KTW.Draft.GetDto(session);

            // then
            actual.Phase.Should().Be("pickBan");
            actual.PickBans.Should().BeEquivalentTo(expectedPickBan);
        }

        [Test]
        public void ShouldBeInNominationPhaseIfAllPickBansWereDone()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(Data.GetAllPickBans().Item2);

            var expectedNominations = new List<KTW.NominationDto>
            {
                new KTW.NominationDto { Player = "Player 2", PlayerIndex = 2, Action = null, Choice = null },
                new KTW.NominationDto { Player = "Player 5", PlayerIndex = 5, Action = null, Choice = null },
                new KTW.NominationDto { Player = "Player 3", PlayerIndex = 3, Action = null, Choice = null },
                new KTW.NominationDto { Player = "Player 1", PlayerIndex = 1, Action = null, Choice = null },
                new KTW.NominationDto { Player = "Player 0", PlayerIndex = 0, Action = null, Choice = null },
                new KTW.NominationDto { Player = "Player 4", PlayerIndex = 4, Action = null, Choice = null },
                new KTW.NominationDto { Player = "Player 4", PlayerIndex = 4, Action = null, Choice = null },
                new KTW.NominationDto { Player = "Player 0", PlayerIndex = 0, Action = null, Choice = null },
                new KTW.NominationDto { Player = "Player 1", PlayerIndex = 1, Action = null, Choice = null },
                new KTW.NominationDto { Player = "Player 3", PlayerIndex = 3, Action = null, Choice = null },
                new KTW.NominationDto { Player = "Player 5", PlayerIndex = 5, Action = null, Choice = null },
                new KTW.NominationDto { Player = "Player 2", PlayerIndex = 2, Action = null, Choice = null },
            };

            // when
            var actual = KTW.Draft.GetDto(session);

            // then
            actual.Phase.Should().Be("nominations");
            actual.PickBans.Should().BeEquivalentTo(Data.GetAllPickBans().Item1);
            actual.Nominations.Should().BeEquivalentTo(expectedNominations);
        }

        [Test]
        public void ShouldLoadNominationsAndConfirmationsFromEvents()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(Data.GetAllPickBans().Item2);
            session.Events.AddRange(new List<GameEvent>
            {
                new GameEvent
                {
                    EventType = nameof(KTW.Nomination),
                    SerializedPayload = JsonConvert.SerializeObject(new KTW.NominationPayload
                    {
                        PlayerIndex = 2,
                        Action = "nominate",
                        Faction = "The_Mahact_Gene__Sorcerers",
                    }),
                },
                new GameEvent
                {
                    EventType = nameof(KTW.Nomination),
                    SerializedPayload = JsonConvert.SerializeObject(new KTW.NominationPayload
                    {
                        PlayerIndex = 5,
                        Action = "nominate",
                        Faction = "The_Titans_of_Ul",
                    }),
                },
                new GameEvent
                {
                    EventType = nameof(KTW.Nomination),
                    SerializedPayload = JsonConvert.SerializeObject(new KTW.NominationPayload
                    {
                        PlayerIndex = 5,
                        Action = "confirm",
                        Faction = "The_Mahact_Gene__Sorcerers",
                    }),
                },
            });

            var expectedNominations = new List<KTW.NominationDto>
            {
                new KTW.NominationDto { Player = "Player 2", PlayerIndex = 2, Action = "nominate", Choice = "The_Mahact_Gene__Sorcerers" },
                new KTW.NominationDto { Player = "Player 5", PlayerIndex = 5, Action = "nominate", Choice = "The_Titans_of_Ul" },
                new KTW.NominationDto { Player = "Player 3", PlayerIndex = 3, Action = "confirm", Choice = "The_Mahact_Gene__Sorcerers" },
                new KTW.NominationDto { Player = "Player 1", PlayerIndex = 1, Action = null, Choice = null },
                new KTW.NominationDto { Player = "Player 0", PlayerIndex = 0, Action = null, Choice = null },
                new KTW.NominationDto { Player = "Player 4", PlayerIndex = 4, Action = null, Choice = null },
                new KTW.NominationDto { Player = "Player 4", PlayerIndex = 4, Action = null, Choice = null },
                new KTW.NominationDto { Player = "Player 0", PlayerIndex = 0, Action = null, Choice = null },
                new KTW.NominationDto { Player = "Player 1", PlayerIndex = 1, Action = null, Choice = null },
                new KTW.NominationDto { Player = "Player 3", PlayerIndex = 3, Action = null, Choice = null },
                new KTW.NominationDto { Player = "Player 5", PlayerIndex = 5, Action = null, Choice = null },
                new KTW.NominationDto { Player = "Player 2", PlayerIndex = 2, Action = null, Choice = null },
            };

            // when
            var actual = KTW.Draft.GetDto(session);

            // then
            actual.Phase.Should().Be("nominations");
            actual.Nominations.Should().BeEquivalentTo(expectedNominations);
        }

        [Test]
        public void ShouldBeInDraftPhaseIfAllNominationsDone()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(Data.GetAllPickBans().Item2);
            session.Events.AddRange(Data.GetAllNominations().Item2);

            var expectedDraft = new List<KTW.ActualDraftDto>
            {
                new KTW.ActualDraftDto { Player = "Player 2", PlayerIndex = 2, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 5", PlayerIndex = 5, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 3", PlayerIndex = 3, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 1", PlayerIndex = 1, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 0", PlayerIndex = 0, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 4", PlayerIndex = 4, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 4", PlayerIndex = 4, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 0", PlayerIndex = 0, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 1", PlayerIndex = 1, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 3", PlayerIndex = 3, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 5", PlayerIndex = 5, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 2", PlayerIndex = 2, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 2", PlayerIndex = 2, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 5", PlayerIndex = 5, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 3", PlayerIndex = 3, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 1", PlayerIndex = 1, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 0", PlayerIndex = 0, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 4", PlayerIndex = 4, Action = null, Choice = null },
            };

            // when
            var actual = KTW.Draft.GetDto(session);

            // then
            actual.Phase.Should().Be("draft");
            actual.PickBans.Should().BeEquivalentTo(Data.GetAllPickBans().Item1);
            actual.Nominations.Should().BeEquivalentTo(Data.GetAllNominations().Item1);
            actual.Draft.Should().BeEquivalentTo(expectedDraft);
        }

        [Test]
        public void ShouldIncludeChoicesInDraft()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(Data.GetAllPickBans().Item2);
            session.Events.AddRange(Data.GetAllNominations().Item2);
            session.Events.AddRange(new List<GameEvent>
            {
                new GameEvent
                {
                    EventType = nameof(KTW.DraftPick),
                    SerializedPayload = JsonConvert.SerializeObject(new KTW.DraftPickPayload
                        {
                        PlayerIndex = 2,
                        Action = "initiative",
                        Choice = "1",
                        }),
                },
                new GameEvent
                {
                EventType = nameof(KTW.DraftPick),
                SerializedPayload = JsonConvert.SerializeObject(new KTW.DraftPickPayload
                        {
                        PlayerIndex = 5,
                        Action = "initiative",
                        Choice = "2",
                        }),
                },
                new GameEvent
                {
                EventType = nameof(KTW.DraftPick),
                SerializedPayload = JsonConvert.SerializeObject(new KTW.DraftPickPayload
                        {
                        PlayerIndex = 3,
                        Action = "tablePosition",
                        Choice = "0",
                        }),
                },
                new GameEvent
                {
                EventType = nameof(KTW.DraftPick),
                SerializedPayload = JsonConvert.SerializeObject(new KTW.DraftPickPayload
                        {
                        PlayerIndex = 1,
                        Action = "faction",
                        Choice = "The_Arborec",
                        }),
                },
            });

            var expectedDraft = new List<KTW.ActualDraftDto>
            {
                new KTW.ActualDraftDto { Player = "Player 2", PlayerIndex = 2, Action = "initiative", Choice = "1" },
                new KTW.ActualDraftDto { Player = "Player 5", PlayerIndex = 5, Action = "initiative", Choice = "2" },
                new KTW.ActualDraftDto { Player = "Player 3", PlayerIndex = 3, Action = "tablePosition", Choice = "0" },
                new KTW.ActualDraftDto { Player = "Player 1", PlayerIndex = 1, Action = "faction", Choice = "The_Arborec" },
                new KTW.ActualDraftDto { Player = "Player 0", PlayerIndex = 0, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 4", PlayerIndex = 4, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 4", PlayerIndex = 4, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 0", PlayerIndex = 0, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 1", PlayerIndex = 1, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 3", PlayerIndex = 3, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 5", PlayerIndex = 5, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 2", PlayerIndex = 2, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 2", PlayerIndex = 2, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 5", PlayerIndex = 5, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 3", PlayerIndex = 3, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 1", PlayerIndex = 1, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 0", PlayerIndex = 0, Action = null, Choice = null },
                new KTW.ActualDraftDto { Player = "Player 4", PlayerIndex = 4, Action = null, Choice = null },
            };

            // when
            var actual = KTW.Draft.GetDto(session);

            // then
            actual.Phase.Should().Be("draft");
            actual.PickBans.Should().BeEquivalentTo(Data.GetAllPickBans().Item1);
            actual.Nominations.Should().BeEquivalentTo(Data.GetAllNominations().Item1);
            actual.Draft.Should().BeEquivalentTo(expectedDraft);
        }

        [Test]
        public void ShouldGeneratePlayerDto()
        {
            // given
            var session = Data.GetSessionWithDraftCommitted();
            var expectedPlayersDto = new List<PlayerDto>
            {
                new PlayerDto
                {
                    Speaker = true,
                    PlayerName = "Player 2",
                    Faction = "The_Embers_of_Muaat",
                    AtTable = 1,
                    Initiative = 1,
                },
                new PlayerDto
                {
                    PlayerName = "Player 5",
                    Faction = "The_L1Z1X_Mindnet",
                    AtTable = 4,
                    Initiative = 2,
                },
                new PlayerDto
                {
                    PlayerName = "Player 4",
                    Faction = "The_Argent_Flight",
                    AtTable = 3,
                    Initiative = 3,
                },
                new PlayerDto
                {
                    PlayerName = "Player 1",
                    Faction = "The_Arborec",
                    AtTable = 5,
                    Initiative = 4,
                },
                new PlayerDto
                {
                    PlayerName = "Player 3",
                    Faction = "The_Yin_Brotherhood",
                    AtTable = 0,
                    Initiative = 5,
                },
                new PlayerDto
                {
                    PlayerName = "Player 0",
                    Faction = "The_Barony_of_Letnev",
                    AtTable = 2,
                    Initiative = 6,
                },
            };

            // when
            var actual = KTW.Draft.GeneratePlayerDto(session);

            // then
            actual.Should().BeEquivalentTo(expectedPlayersDto);
        }

        [Test]
        public void ShouldReturnEmptiesIfNotEnoughDraftPicks()
        {
            // given
            var session = Data.GetFullyDraftedSession();
            session.Events.RemoveRange(session.Events.Count - 6, 6);
            var expectedPlayersDto = new List<PlayerDto>
            {
                new PlayerDto
                {
                    PlayerName = "Player 0",
                    Faction = "The_Barony_of_Letnev",
                    AtTable = 2,
                    Initiative = 0,
                },
                new PlayerDto
                {
                    PlayerName = "Player 1",
                    Faction = "The_Arborec",
                    AtTable = -1,
                    Initiative = 4,
                },
                new PlayerDto
                {
                    Speaker = true,
                    PlayerName = "Player 2",
                    Faction = "The_Embers_of_Muaat",
                    AtTable = -1,
                    Initiative = 1,
                },
                new PlayerDto
                {
                    PlayerName = "Player 3",
                    Faction = "The_Yin_Brotherhood",
                    AtTable = 0,
                    Initiative = 0,
                },
                new PlayerDto
                {
                    PlayerName = "Player 4",
                    Faction = null,
                    AtTable = 3,
                    Initiative = 3,
                },
                new PlayerDto
                {
                    PlayerName = "Player 5",
                    Faction = "The_L1Z1X_Mindnet",
                    AtTable = -1,
                    Initiative = 2,
                },
            };

            // when
            var actual = KTW.Draft.GeneratePlayerDto(session);
            System.Console.WriteLine(JsonConvert.SerializeObject(actual));

            // then
            actual.Should().BeEquivalentTo(expectedPlayersDto);
        }

        [Test]
        public void ShouldReturnEmptyDtosForNoDraftPickSession()
        {
            // given
            var session = Data.GetEmptySession();
            session.Events.AddRange(Data.GetAllPickBans().Item2);
            session.Events.AddRange(Data.GetAllNominations().Item2);
            var expectedPlayersDto = new List<PlayerDto>
            {
                new PlayerDto
                {
                    PlayerName = "Player 0",
                    Faction = null,
                    AtTable = -1,
                },
                new PlayerDto
                {
                    PlayerName = "Player 1",
                    Faction = null,
                    AtTable = -1,
                },
                new PlayerDto
                {
                    PlayerName = "Player 2",
                    Faction = null,
                    AtTable = -1,
                },
                new PlayerDto
                {
                    PlayerName = "Player 3",
                    Faction = null,
                    AtTable = -1,
                },
                new PlayerDto
                {
                    PlayerName = "Player 4",
                    Faction = null,
                    AtTable = -1,
                },
                new PlayerDto
                {
                    PlayerName = "Player 5",
                    Faction = null,
                    AtTable = -1,
                },
            };

            // when
            var actual = KTW.Draft.GeneratePlayerDto(session);
            System.Console.WriteLine(JsonConvert.SerializeObject(actual));

            // then
            actual.Should().BeEquivalentTo(expectedPlayersDto);
        }
    }
}
