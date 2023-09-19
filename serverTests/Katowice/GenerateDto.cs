using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using NUnit.Framework;
using Server.Domain;
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
            var session = new Session
            {
                Events = new List<GameEvent>
                {
                    new GameEvent
                    {
                        EventType = nameof(GameStarted),
                        SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload
                        {
                            SetupType = "katowice_draft",
                            Options = new DraftOptions
                            {
                                InitialPool = GetInitialPool(),
                                Players = new string[] { "Player 0", "Player 1", "Player 2", "Player 3", "Player 4", "Player 5" },
                            },
                            RandomPlayerOrder = new int[] { 2, 5, 3, 1, 0, 4 },
                        }),
                    },
                }
            };

            var expectedPickBan = new KTW.PickBanDto[] {
                new KTW.PickBanDto{ Player = "Player 2", PlayerIndex = 2, Action = "ban", Choice = null },
                new KTW.PickBanDto{ Player = "Player 5", PlayerIndex = 5, Action = "pick", Choice = null },
                new KTW.PickBanDto{ Player = "Player 3", PlayerIndex = 3, Action = "ban", Choice = null },
                new KTW.PickBanDto{ Player = "Player 1", PlayerIndex = 1, Action = "pick", Choice = null },
                new KTW.PickBanDto{ Player = "Player 0", PlayerIndex = 0, Action = "ban", Choice = null },
                new KTW.PickBanDto{ Player = "Player 4", PlayerIndex = 4, Action = "pick", Choice = null },
                new KTW.PickBanDto{ Player = "Player 4", PlayerIndex = 4, Action = "ban", Choice = null },
                new KTW.PickBanDto{ Player = "Player 0", PlayerIndex = 0, Action = "pick", Choice = null },
                new KTW.PickBanDto{ Player = "Player 1", PlayerIndex = 1, Action = "ban", Choice = null },
                new KTW.PickBanDto{ Player = "Player 3", PlayerIndex = 3, Action = "pick", Choice = null },
                new KTW.PickBanDto{ Player = "Player 5", PlayerIndex = 5, Action = "ban", Choice = null },
                new KTW.PickBanDto{ Player = "Player 2", PlayerIndex = 2, Action = "pick", Choice = null },
            };

            // when
            var actual = KTW.Draft.GetDto(session);

            // then
            actual.Phase.Should().Be("pickBan");
            actual.InitialPool.Should().BeEquivalentTo(GetInitialPool());
            actual.PickBans.Should().BeEquivalentTo(expectedPickBan);
        }

        [Test]
        public void ShouldIncludePlayerChoicesInPickBans()
        {
            // given
            var session = new Session
            {
                Events = new List<GameEvent>
                {
                    new GameEvent
                    {
                        EventType = nameof(GameStarted),
                        SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload
                        {
                            SetupType = "katowice_draft",
                            Options = new DraftOptions
                            {
                                InitialPool = GetInitialPool(),
                                Players = new string[] { "Player 0", "Player 1", "Player 2", "Player 3", "Player 4", "Player 5" },
                            },
                            RandomPlayerOrder = new int[] { 2, 5, 3, 1, 0, 4 },
                        }),
                    },
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
                }
            };

            var expectedPickBan = new KTW.PickBanDto[] {
                new KTW.PickBanDto{ Player = "Player 2", PlayerIndex = 2, Action = "ban", Choice = "The_Naalu_Collective" },
                new KTW.PickBanDto{ Player = "Player 5", PlayerIndex = 5, Action = "pick", Choice = "The_Arborec" },
                new KTW.PickBanDto{ Player = "Player 3", PlayerIndex = 3, Action = "ban", Choice = null },
                new KTW.PickBanDto{ Player = "Player 1", PlayerIndex = 1, Action = "pick", Choice = null },
                new KTW.PickBanDto{ Player = "Player 0", PlayerIndex = 0, Action = "ban", Choice = null },
                new KTW.PickBanDto{ Player = "Player 4", PlayerIndex = 4, Action = "pick", Choice = null },
                new KTW.PickBanDto{ Player = "Player 4", PlayerIndex = 4, Action = "ban", Choice = null },
                new KTW.PickBanDto{ Player = "Player 0", PlayerIndex = 0, Action = "pick", Choice = null },
                new KTW.PickBanDto{ Player = "Player 1", PlayerIndex = 1, Action = "ban", Choice = null },
                new KTW.PickBanDto{ Player = "Player 3", PlayerIndex = 3, Action = "pick", Choice = null },
                new KTW.PickBanDto{ Player = "Player 5", PlayerIndex = 5, Action = "ban", Choice = null },
                new KTW.PickBanDto{ Player = "Player 2", PlayerIndex = 2, Action = "pick", Choice = null },
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
            var session = new Session
            {
                Events = new List<GameEvent>
                {
                    new GameEvent
                    {
                        EventType = nameof(GameStarted),
                        SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload
                        {
                            SetupType = "katowice_draft",
                            Options = new DraftOptions
                            {
                                InitialPool = GetInitialPool(),
                                Players = new string[] { "Player 0", "Player 1", "Player 2", "Player 3", "Player 4", "Player 5" },
                            },
                            RandomPlayerOrder = new int[] { 2, 5, 3, 1, 0, 4 },
                        }),
                    },
                }
            };
            session.Events.AddRange(GetAllPickBans().Item2);

            var expectedNominations = new List<KTW.NominationDto> {
                new KTW.NominationDto{ Player = "Player 2", PlayerIndex = 2, Action = null, Choice = null },
                new KTW.NominationDto{ Player = "Player 5", PlayerIndex = 5, Action = null, Choice = null },
                new KTW.NominationDto{ Player = "Player 3", PlayerIndex = 3, Action = null, Choice = null },
                new KTW.NominationDto{ Player = "Player 1", PlayerIndex = 1, Action = null, Choice = null },
                new KTW.NominationDto{ Player = "Player 0", PlayerIndex = 0, Action = null, Choice = null },
                new KTW.NominationDto{ Player = "Player 4", PlayerIndex = 4, Action = null, Choice = null },
                new KTW.NominationDto{ Player = "Player 4", PlayerIndex = 4, Action = null, Choice = null },
                new KTW.NominationDto{ Player = "Player 0", PlayerIndex = 0, Action = null, Choice = null },
                new KTW.NominationDto{ Player = "Player 1", PlayerIndex = 1, Action = null, Choice = null },
                new KTW.NominationDto{ Player = "Player 3", PlayerIndex = 3, Action = null, Choice = null },
                new KTW.NominationDto{ Player = "Player 5", PlayerIndex = 5, Action = null, Choice = null },
                new KTW.NominationDto{ Player = "Player 2", PlayerIndex = 2, Action = null, Choice = null },
            };

            // when
            var actual = KTW.Draft.GetDto(session);

            // then
            actual.Phase.Should().Be("nominations");
            actual.PickBans.Should().BeEquivalentTo(GetAllPickBans().Item1);
            actual.Nominations.Should().BeEquivalentTo(expectedNominations);
        }

        [Test]
        public void ShouldLoadNominationsAndConfirmationsFromEvents()
        {
            // given
            var session = new Session
            {
                Events = new List<GameEvent>
                {
                    new GameEvent
                    {
                        EventType = nameof(GameStarted),
                        SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload
                        {
                            SetupType = "katowice_draft",
                            Options = new DraftOptions
                            {
                                InitialPool = GetInitialPool(),
                                Players = new string[] { "Player 0", "Player 1", "Player 2", "Player 3", "Player 4", "Player 5" },
                            },
                            RandomPlayerOrder = new int[] { 2, 5, 3, 1, 0, 4 },
                        }),
                    },
                }
            };
            session.Events.AddRange(GetAllPickBans().Item2);
            session.Events.AddRange(new List<GameEvent>{
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

            var expectedNominations = new List<KTW.NominationDto> {
                new KTW.NominationDto{ Player = "Player 2", PlayerIndex = 2, Action = "nominate", Choice = "The_Mahact_Gene__Sorcerers" },
                new KTW.NominationDto{ Player = "Player 5", PlayerIndex = 5, Action = "nominate", Choice = "The_Titans_of_Ul" },
                new KTW.NominationDto{ Player = "Player 3", PlayerIndex = 3, Action = "confirm", Choice = "The_Mahact_Gene__Sorcerers" },
                new KTW.NominationDto{ Player = "Player 1", PlayerIndex = 1, Action = null, Choice = null },
                new KTW.NominationDto{ Player = "Player 0", PlayerIndex = 0, Action = null, Choice = null },
                new KTW.NominationDto{ Player = "Player 4", PlayerIndex = 4, Action = null, Choice = null },
                new KTW.NominationDto{ Player = "Player 4", PlayerIndex = 4, Action = null, Choice = null },
                new KTW.NominationDto{ Player = "Player 0", PlayerIndex = 0, Action = null, Choice = null },
                new KTW.NominationDto{ Player = "Player 1", PlayerIndex = 1, Action = null, Choice = null },
                new KTW.NominationDto{ Player = "Player 3", PlayerIndex = 3, Action = null, Choice = null },
                new KTW.NominationDto{ Player = "Player 5", PlayerIndex = 5, Action = null, Choice = null },
                new KTW.NominationDto{ Player = "Player 2", PlayerIndex = 2, Action = null, Choice = null },
            };

            // when
            var actual = KTW.Draft.GetDto(session);

            // then
            actual.Phase.Should().Be("nominations");
            actual.Nominations.Should().BeEquivalentTo(expectedNominations);
        }

        private Tuple<IEnumerable<KTW.PickBanDto>, IEnumerable<GameEvent>> GetAllPickBans()
        {
            IEnumerable<KTW.PickBanDto> resultingDto = new List<KTW.PickBanDto> {
                new KTW.PickBanDto{ Player = "Player 2", PlayerIndex = 2, Action = "ban", Choice = "The_Naalu_Collective" },
                new KTW.PickBanDto{ Player = "Player 5", PlayerIndex = 5, Action = "pick", Choice = "The_Arborec" },
                new KTW.PickBanDto{ Player = "Player 3", PlayerIndex = 3, Action = "ban", Choice = "The_Universities_of_Jol__Nar" },
                new KTW.PickBanDto{ Player = "Player 1", PlayerIndex = 1, Action = "pick", Choice = "The_Barony_of_Letnev" },
                new KTW.PickBanDto{ Player = "Player 0", PlayerIndex = 0, Action = "ban", Choice = "The_Clan_of_Saar" },
                new KTW.PickBanDto{ Player = "Player 4", PlayerIndex = 4, Action = "pick", Choice = "The_Embers_of_Muaat" },
                new KTW.PickBanDto{ Player = "Player 4", PlayerIndex = 4, Action = "ban", Choice = "The_Emirates_of_Hacan" },
                new KTW.PickBanDto{ Player = "Player 0", PlayerIndex = 0, Action = "pick", Choice = "The_L1Z1X_Mindnet" },
                new KTW.PickBanDto{ Player = "Player 1", PlayerIndex = 1, Action = "ban", Choice = "The_Nekro_Virus" },
                new KTW.PickBanDto{ Player = "Player 3", PlayerIndex = 3, Action = "pick", Choice = "The_Yin_Brotherhood" },
                new KTW.PickBanDto{ Player = "Player 5", PlayerIndex = 5, Action = "ban", Choice = "The_Xxcha_Kingdom" },
                new KTW.PickBanDto{ Player = "Player 2", PlayerIndex = 2, Action = "pick", Choice = "The_Argent_Flight" },
            };

            var gameEvents = resultingDto.Select(dto => new GameEvent
            {
                EventType = nameof(KTW.PickBan),
                SerializedPayload = JsonConvert.SerializeObject(new KTW.PickBanPayload
                {
                    PlayerIndex = dto.PlayerIndex,
                    Action = dto.Action,
                    Faction = dto.Choice,
                }),
            });

            return Tuple.Create(resultingDto, gameEvents);
        }

        private string[] GetInitialPool()
        {
            return new string[] {
                "The_Arborec",
                "The_Barony_of_Letnev",
                "The_Clan_of_Saar",
                "The_Embers_of_Muaat",
                "The_Emirates_of_Hacan",
                "The_Federation_of_Sol",
                "The_Ghosts_of_Creuss",
                "The_L1Z1X_Mindnet",
                "The_Mentak_Coalition",
                "The_Naalu_Collective",
                "The_Nekro_Virus",
                "Sardakk_Norr",
                "The_Universities_of_Jol__Nar",
                "The_Winnu",
                "The_Xxcha_Kingdom",
                "The_Yin_Brotherhood",
                "The_Yssaril_Tribes",
                "The_Argent_Flight",
                "The_Empyrean",
                "The_Mahact_Gene__Sorcerers",
                "The_Naaz__Rokha_Alliance",
                "The_Nomad",
                "The_Titans_of_Ul",
                "The_VuilRaith_Cabal",
                "The_Council_Keleres",
            };
        }
    }
}
