using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Newtonsoft.Json;
using NSubstitute;
using NUnit.Framework;
using server.Domain;
using server.Domain.Exceptions;

namespace serverTests.Handlers
{
    public class Picked
    {
        IRepository Repository { get; set; }
        ITimeProvider TimeProvider { get; set; }

        public Picked()
        {
            Repository = Substitute.For<IRepository>();
            TimeProvider = Substitute.For<ITimeProvider>();
        }

        [Test]
        public async Task ShouldAddPickEventToSessionEvents()
        {
            // given
            var sessionId = Guid.NewGuid();
            var session = new Session()
            {
                Id = sessionId,
                Events = new List<GameEvent>() {
                    new GameEvent {
                        EventType = nameof(GameStarted),
                        SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload {
                            Options = new DraftOptions {
                                InitialPool = new string[] { "faction1", "faction2", "faction 3"},
                                Players = new string [] { "player1", "player2" },
                            },
                        })
                    }
                },
            };
            Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var pickedHandler = new server.Domain.Picked(Repository);
            var given = new GameEvent
            {
                EventType = nameof(server.Domain.Picked),
                SerializedPayload = JsonConvert.SerializeObject(new PickedPayload
                {
                    Pick = "faction1",
                    Type = "faction",
                    PlayerIndex = 0,
                    PlayerName = "player1",
                }),
            };

            // when
            await pickedHandler.Handle(given);

            // then
            Assert.True(session.Events.Contains(given));
        }

        [Test]
        public async Task ShouldNotAllowTablePickIfNotEnabledInOptions()
        {
            // given
            var sessionId = Guid.NewGuid();
            var session = new Session()
            {
                Id = sessionId,
                Events = new List<GameEvent>() {
                    new GameEvent {
                        EventType = nameof(GameStarted),
                        SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload {
                            Options = new DraftOptions {
                                InitialPool = new string[] { "faction1", "faction2", "faction 3"},
                                Players = new string [] { "player1", "player2" },
                            },
                        })
                    },
                },
            };
            Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var pickedHandler = new server.Domain.Picked(Repository);
            var given = new GameEvent
            {
                EventType = nameof(server.Domain.Picked),
                SerializedPayload = JsonConvert.SerializeObject(new PickedPayload
                {
                    Pick = "faction1",
                    Type = "tablePosition",
                    PlayerIndex = 0,
                    PlayerName = "player1",
                }),
            };

            // when
            Func<Task> act = () => pickedHandler.Handle(given);

            // then
            await act.Should().ThrowAsync<TablePickNotAllowedException>();
        }

        [Test]
        public async Task ShouldNotAllowSpeakerPickIfNotEnabledInOptions()
        {
            // given
            var sessionId = Guid.NewGuid();
            var session = new Session()
            {
                Id = sessionId,
                Events = new List<GameEvent>() {
                    new GameEvent {
                        EventType = nameof(GameStarted),
                        SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload {
                            Options = new DraftOptions {
                                InitialPool = new string[] { "faction1", "faction2", "faction 3"},
                                Players = new string [] { "player1", "player2" },
                            },
                        })
                    },
                },
            };
            Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var pickedHandler = new server.Domain.Picked(Repository);
            var given = new GameEvent
            {
                EventType = nameof(server.Domain.Picked),
                SerializedPayload = JsonConvert.SerializeObject(new PickedPayload
                {
                    Pick = "faction1",
                    Type = "speaker",
                    PlayerIndex = 0,
                    PlayerName = "player1",
                }),
            };

            // when
            Func<Task> act = () => pickedHandler.Handle(given);

            // then
            await act.Should().ThrowAsync<SpeakerPickNotAllowedException>();
        }

        [Test]
        public async Task ShouldNotAddEventIfPlayerHasAlreadyPickedFactionWhenOnlyFactionsArePicked()
        {
            // given
            var sessionId = Guid.NewGuid();
            var session = new Session()
            {
                Id = sessionId,
                Events = new List<GameEvent>() {
                    new GameEvent {
                        EventType = nameof(GameStarted),
                        SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload {
                            Options = new DraftOptions {
                                InitialPool = new string[] { "faction1", "faction2", "faction 3"},
                                Players = new string [] { "player1", "player2" },
                            },
                        })
                    },
                    new GameEvent {
                        EventType = nameof(server.Domain.Picked),
                        SerializedPayload = JsonConvert.SerializeObject(new PickedPayload {
                            Pick = "faction1",
                            Type = "faction",
                            PlayerIndex = 0,
                            PlayerName = "player1",
                        }),
                    }
                },
            };
            Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var pickedHandler = new server.Domain.Picked(Repository);
            var given = new GameEvent
            {
                EventType = nameof(server.Domain.Picked),
                SerializedPayload = JsonConvert.SerializeObject(new PickedPayload
                {
                    Pick = "faction1",
                    Type = "faction",
                    PlayerIndex = 0,
                    PlayerName = "player1",
                }),
            };

            // when
            Func<Task> act = () => pickedHandler.Handle(given);

            // then
            await act.Should().ThrowAsync<AlreadyDoneException>();
        }

        [Test]
        public async Task ShouldAllowNewTypeOfPickToPlayerWhenPickingMultipleThings()
        {
            // given
            var sessionId = Guid.NewGuid();
            var session = new Session()
            {
                Id = sessionId,
                Events = new List<GameEvent>() {
                    new GameEvent {
                        EventType = nameof(GameStarted),
                        SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload {
                            Options = new DraftOptions {
                                InitialPool = new string[] { "faction1", "faction2", "faction 3"},
                                Players = new string [] { "player1", "player2" },
                                TablePick = true,
                            },
                        })
                    },
                    new GameEvent {
                        EventType = nameof(server.Domain.Picked),
                        SerializedPayload = JsonConvert.SerializeObject(new PickedPayload {
                            Pick = "faction1",
                            Type = "faction",
                            PlayerIndex = 0,
                            PlayerName = "player1",
                        }),
                    },
                    new GameEvent {
                        EventType = nameof(server.Domain.Picked),
                        SerializedPayload = JsonConvert.SerializeObject(new PickedPayload {
                            Pick = "faction2",
                            Type = "faction",
                            PlayerIndex = 1,
                            PlayerName = "player2",
                        }),
                    }
                },
            };
            Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(session);

            var pickedHandler = new server.Domain.Picked(Repository);
            var given = new GameEvent()
            {
                SessionId = sessionId,
                EventType = nameof(server.Domain.Picked),
                SerializedPayload = JsonConvert.SerializeObject(new PickedPayload
                {
                    Pick = "1",
                    Type = "tablePosition",
                    PlayerIndex = 0,
                    PlayerName = "player1",
                }),
            };

            // when
            await pickedHandler.Handle(given);

            // then
            Assert.True(session.Events.Contains(given));
        }
    }
}
