using FluentAssertions;
using Newtonsoft.Json;
using NSubstitute;
using NUnit.Framework;
using server.Domain;
using server.Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ServerTests.Handlers
{
    public class Banned
    {
        public Banned()
        {
            this.Repository = Substitute.For<IRepository>();
            this.TimeProvider = Substitute.For<ITimeProvider>();
        }

        private IRepository Repository { get; set; }

        private ITimeProvider TimeProvider { get; set; }

        [Test]
        public async Task ShouldAddBanEventToSessionEvents()
        {
            // given
            var sessionId = Guid.NewGuid();
            var session = new Session()
            {
                Id = sessionId,
                Events = new List<GameEvent>()
                {
                    new GameEvent
                    {
                        EventType = nameof(GameStarted),
                        SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload
                        {
                            Options = new DraftOptions
                            {
                                Bans = true,
                            },
                        }),
                    },
                },
            };
            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var bannedHandler = new server.Domain.Banned(this.Repository, this.TimeProvider);
            var given = new GameEvent()
            {
                SessionId = sessionId,
            };

            // when
            await bannedHandler.Handle(given);

            // then
            Assert.True(session.Events.Contains(given));
        }

        [Test]
        public async Task ShouldNotAllowBansIfNotEnabledInOptions()
        {
            // given
            var sessionId = Guid.NewGuid();
            var session = new Session()
            {
                Id = sessionId,
                Events = new List<GameEvent>()
                {
                    new GameEvent
                    {
                        EventType = nameof(GameStarted),
                        SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload
                        {
                            Options = new DraftOptions
                            {
                                Bans = false,
                                InitialPool = new string[] { "faction1", "faction2", "faction 3" },
                                Players = new string[] { "player1", "player2" },
                            },
                        }),
                    },
                },
            };
            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var bannedHandler = new server.Domain.Banned(this.Repository, this.TimeProvider);
            var given = new GameEvent()
            {
                SessionId = sessionId,
                EventType = nameof(server.Domain.Banned),
                SerializedPayload = JsonConvert.SerializeObject(new BannedPayload
                {
                    Bans = new string[] { "faction1" },
                    PlayerIndex = 0,
                    PlayerName = "player1",
                }),
            };

            // when
            Func<Task> act = () => bannedHandler.Handle(given);

            // then
            await act.Should().ThrowAsync<BansNotAllowedException>();
        }

        [Test]
        public async Task ShouldNotAddEventIfPlayerHasAlreadyBannedInSingleRoundBan()
        {
            // given
            var sessionId = Guid.NewGuid();
            var session = new Session()
            {
                Id = sessionId,
                Events = new List<GameEvent>()
                {
                    new GameEvent
                    {
                        EventType = nameof(GameStarted),
                        SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload
                        {
                            Options = new DraftOptions
                            {
                                Bans = true,
                                BanRounds = 1,
                                BansPerRound = 2,
                                InitialPool = new string[] { "faction1", "faction2", "faction 3" },
                                Players = new string[] { "player1", "player2" },
                            },
                        }),
                    },
                    new GameEvent
                    {
                        EventType = nameof(server.Domain.Banned),
                        SerializedPayload = JsonConvert.SerializeObject(new BannedPayload
                        {
                            Bans = new string[] { "faction1" },
                            PlayerIndex = 0,
                            PlayerName = "player1",
                        }),
                    },
                },
            };
            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var bannedHandler = new server.Domain.Banned(this.Repository, this.TimeProvider);
            var given = new GameEvent()
            {
                SessionId = sessionId,
                EventType = nameof(server.Domain.Banned),
                SerializedPayload = JsonConvert.SerializeObject(new BannedPayload
                {
                    Bans = new string[] { "faction1" },
                    PlayerIndex = 0,
                    PlayerName = "player1",
                }),
            };

            // when
            Func<Task> act = () => bannedHandler.Handle(given);

            // then
            await act.Should().ThrowAsync<AlreadyDoneException>();
        }

        [Test]
        public async Task ShouldAllowNewBanToPlayerOnMultipleBanRounds()
        {
            // given
            var sessionId = Guid.NewGuid();
            var session = new Session()
            {
                Id = sessionId,
                Events = new List<GameEvent>()
                {
                    new GameEvent
                    {
                        EventType = nameof(GameStarted),
                        SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload
                        {
                            Options = new DraftOptions
                            {
                                Bans = true,
                                BanRounds = 2,
                                BansPerRound = 1,
                                InitialPool = new string[] { "faction1", "faction2", "faction 3" },
                                Players = new string[] { "player1", "player2" },
                            },
                        }),
                    },
                    new GameEvent
                    {
                        EventType = nameof(server.Domain.Banned),
                        SerializedPayload = JsonConvert.SerializeObject(new BannedPayload
                        {
                            Bans = new string[] { "faction1" },
                            PlayerIndex = 0,
                            PlayerName = "player1",
                        }),
                    },
                    new GameEvent
                    {
                        EventType = nameof(server.Domain.Banned),
                        SerializedPayload = JsonConvert.SerializeObject(new BannedPayload
                        {
                            Bans = new string[] { "faction2" },
                            PlayerIndex = 1,
                            PlayerName = "player2",
                        }),
                    },
                },
            };
            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var bannedHandler = new server.Domain.Banned(this.Repository, this.TimeProvider);
            var given = new GameEvent()
            {
                SessionId = sessionId,
                EventType = nameof(server.Domain.Banned),
                SerializedPayload = JsonConvert.SerializeObject(new BannedPayload
                {
                    Bans = new string[] { "faction3" },
                    PlayerIndex = 0,
                    PlayerName = "player1",
                }),
            };

            // when
            await bannedHandler.Handle(given);

            // then
            Assert.True(session.Events.Contains(given));
        }

        [Test]
        public async Task ShouldNotAddEventIfPlayerHasAlreadyBannedInThisRoundBan()
        {
            // given
            var sessionId = Guid.NewGuid();
            var session = new Session()
            {
                Id = sessionId,
                Events = new List<GameEvent>()
                {
                    new GameEvent
                    {
                        EventType = nameof(GameStarted),
                        SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload
                        {
                            Options = new DraftOptions
                            {
                                Bans = true,
                                BanRounds = 2,
                                BansPerRound = 1,
                                InitialPool = new string[] { "faction1", "faction2", "faction 3" },
                                Players = new string[] { "player1", "player2" },
                            },
                        }),
                    },
                    new GameEvent
                    {
                        EventType = nameof(server.Domain.Banned),
                        SerializedPayload = JsonConvert.SerializeObject(new BannedPayload
                        {
                            Bans = new string[] { "faction1" },
                            PlayerIndex = 0,
                            PlayerName = "player1",
                        }),
                    },
                    new GameEvent
                    {
                        EventType = nameof(server.Domain.Banned),
                        SerializedPayload = JsonConvert.SerializeObject(new BannedPayload
                        {
                            Bans = new string[] { "faction2" },
                            PlayerIndex = 1,
                            PlayerName = "player2",
                        }),
                    },
                    new GameEvent
                    {
                        EventType = nameof(server.Domain.Banned),
                        SerializedPayload = JsonConvert.SerializeObject(new BannedPayload
                        {
                            Bans = new string[] { "faction3" },
                            PlayerIndex = 0,
                            PlayerName = "player1",
                        }),
                    },
                },
            };
            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var bannedHandler = new server.Domain.Banned(this.Repository, this.TimeProvider);
            var given = new GameEvent()
            {
                SessionId = sessionId,
                EventType = nameof(server.Domain.Banned),
                SerializedPayload = JsonConvert.SerializeObject(new BannedPayload
                {
                    Bans = new string[] { "faction3" },
                    PlayerIndex = 0,
                    PlayerName = "player1",
                }),
            };

            // when
            Func<Task> act = () => bannedHandler.Handle(given);

            // then
            await act.Should().ThrowAsync<AlreadyDoneException>();
        }
    }
}
