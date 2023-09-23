using FluentAssertions;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using NUnit.Framework;
using Server.Domain;
using System.Collections.Generic;
using System.Linq;

namespace ServerTests
{
    public class DraftSummary
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
        public void ShouldReturnEmptyIfPassedEmpty()
        {
            // given
            var given = new List<GameEvent>();
            var timeline = new Timeline(new Session { Events = given });

            // when
            var actual = timeline.AddDraftSummary().GetEvents();

            // then
            Assert.AreEqual(0, actual.Count());
        }

        [Test]
        public void ShouldAddDraftSummaryAfterDraftWithOnlyFactionPicksHasBeenCommitted()
        {
            // given
            var sessionEvents = new List<GameEvent>()
            {
                new GameEvent
                {
                    EventType = nameof(GameStarted),
                    SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload
                    {
                        Options = new DraftOptions
                        {
                            InitialPool = new string[] { "The_VuilRaith_Cabal", "The_Nomad" },
                            Players = new string[] { "Player 1", "Player 2" },
                            TablePick = true,
                        },
                    }),
                },
                new GameEvent
                {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new PickedPayload
                        {
                        Pick = "The_Nomad",
                        Type = "faction",
                        PlayerIndex = 0,
                        PlayerName = "Player 1",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new PickedPayload
                        {
                        Pick = "The_VuilRaith_Cabal",
                        Type = "faction",
                        PlayerIndex = 1,
                        PlayerName = "Player 2",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(SpeakerSelected),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new SpeakerSelectedPayload
                        {
                        SpeakerIndex = 3,
                        SpeakerName = "Player 2",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(CommitDraft),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new CommitDraftPayload
                        {
                        Factions = new string[] { "The_VuilRaith_Cabal", "The_Nomad" },
                        }, this.SerializerSettings),
                },
            };
            var expected = new List<TimelineEvent>()
            {
                new TimelineEvent
                {
                    Order = 0,
                    EventType = "GameStarted",
                    SerializedPayload = sessionEvents[0].SerializedPayload,
                },
                new TimelineEvent
                {
                    Order = 1,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"The_Nomad\",\"type\":\"faction\",\"playerIndex\":0,\"playerName\":\"Player 1\"}",
                },
                new TimelineEvent
                {
                    Order = 2,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"The_VuilRaith_Cabal\",\"type\":\"faction\",\"playerIndex\":1,\"playerName\":\"Player 2\"}",
                },
                new TimelineEvent
                {
                    Order = 3,
                    EventType = "SpeakerSelected",
                    SerializedPayload = "{\"speakerIndex\":3,\"speakerName\":\"Player 2\"}",
                },
                new TimelineEvent
                {
                    Order = 4,
                    EventType = "CommitDraft",
                    SerializedPayload = "{\"factions\":[\"The_VuilRaith_Cabal\",\"The_Nomad\"],\"tablePositions\":[],\"initiative\":[]}",
                },
                new TimelineEvent
                {
                    Order = 5,
                    EventType = "DraftSummary",
                    SerializedPayload = "{\"speaker\":\"Player 2\",\"picks\":[{\"playerName\":\"Player 1\",\"faction\":\"The_Nomad\",\"tablePosition\":{\"name\":\"-1\",\"color\":null}},{\"playerName\":\"Player 2\",\"faction\":\"The_VuilRaith_Cabal\",\"tablePosition\":{\"name\":\"-1\",\"color\":null}}]}",
                },
            };
            var timeline = new Timeline(new Session
            {
                Events = sessionEvents,
            });

            // when
            var actual = timeline.AddDraftSummary().GetEvents();

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldAddDraftSummaryAfterDraftWithTablePositionHasBeenCommitted()
        {
            // given
            var given = new List<GameEvent>()
            {
                new GameEvent
                {
                    EventType = nameof(GameStarted),
                    SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload
                    {
                        Options = new DraftOptions
                        {
                            InitialPool = new string[] { "The_VuilRaith_Cabal", "The_Nomad" },
                            Players = new string[] { "Player 1", "Player 2" },
                            TablePick = true,
                        },
                    }),
                },
                new GameEvent
                {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new PickedPayload
                        {
                        Pick = "0",
                        Type = "tablePosition",
                        PlayerIndex = 1,
                        PlayerName = "Player 2",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new PickedPayload
                        {
                        Pick = "1",
                        Type = "tablePosition",
                        PlayerIndex = 0,
                        PlayerName = "Player 1",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new PickedPayload
                        {
                        Pick = "The_Nomad",
                        Type = "faction",
                        PlayerIndex = 0,
                        PlayerName = "Player 1",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new PickedPayload
                        {
                        Pick = "The_VuilRaith_Cabal",
                        Type = "faction",
                        PlayerIndex = 1,
                        PlayerName = "Player 2",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(SpeakerSelected),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new SpeakerSelectedPayload
                        {
                        SpeakerIndex = 1,
                        SpeakerName = "Player 2",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(CommitDraft),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new CommitDraftPayload
                        {
                        Factions = new string[] { "The_VuilRaith_Cabal", "The_Nomad" },
                        }, this.SerializerSettings),
                },
            };
            var expected = new List<TimelineEvent>()
            {
                new TimelineEvent
                {
                    Order = 0,
                    EventType = "GameStarted",
                    SerializedPayload = given[0].SerializedPayload,
                },
                new TimelineEvent
                {
                    Order = 1,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"0\",\"type\":\"tablePosition\",\"playerIndex\":1,\"playerName\":\"Player 2\"}",
                },
                new TimelineEvent
                {
                    Order = 2,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"1\",\"type\":\"tablePosition\",\"playerIndex\":0,\"playerName\":\"Player 1\"}",
                },
                new TimelineEvent
                {
                    Order = 3,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"The_Nomad\",\"type\":\"faction\",\"playerIndex\":0,\"playerName\":\"Player 1\"}",
                },
                new TimelineEvent
                {
                    Order = 4,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"The_VuilRaith_Cabal\",\"type\":\"faction\",\"playerIndex\":1,\"playerName\":\"Player 2\"}",
                },
                new TimelineEvent
                {
                    Order = 5,
                    EventType = "SpeakerSelected",
                    SerializedPayload = "{\"speakerIndex\":1,\"speakerName\":\"Player 2\"}",
                },
                new TimelineEvent
                {
                    Order = 6,
                    EventType = "CommitDraft",
                    SerializedPayload = "{\"factions\":[\"The_VuilRaith_Cabal\",\"The_Nomad\"],\"tablePositions\":[],\"initiative\":[]}",
                },
                new TimelineEvent
                {
                    Order = 7,
                    EventType = "DraftSummary",
                    SerializedPayload = "{\"speaker\":\"Player 2\",\"picks\":[{\"playerName\":\"Player 1\",\"faction\":\"The_Nomad\",\"tablePosition\":{\"name\":\"1\",\"color\":null}},{\"playerName\":\"Player 2\",\"faction\":\"The_VuilRaith_Cabal\",\"tablePosition\":{\"name\":\"0\",\"color\":null}}]}",
                },
            };
            var timeline = new Timeline(new Session { Events = given });

            // when
            var actual = timeline.AddDraftSummary().GetEvents();

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldAddDraftSummaryAfterDraftWithTablePositionHasBeenCommittedWithMapPositionNamesFromDraft()
        {
            // given
            var given = new List<GameEvent>()
            {
                new GameEvent
                {
                    EventType = nameof(GameStarted),
                    SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload
                    {
                        Options = new DraftOptions
                        {
                            InitialPool = new string[] { "The_VuilRaith_Cabal", "The_Nomad" },
                            Players = new string[] { "Player 1", "Player 2" },
                            MapPositions = new MapPosition[] { new MapPosition { Name = "aaa", Color = null }, new MapPosition { Name = "bbb", Color = null } },
                            TablePick = true,
                        },
                    }),
                },
                new GameEvent
                {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new PickedPayload
                        {
                        Pick = "0",
                        Type = "tablePosition",
                        PlayerIndex = 1,
                        PlayerName = "Player 2",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new PickedPayload
                        {
                        Pick = "1",
                        Type = "tablePosition",
                        PlayerIndex = 0,
                        PlayerName = "Player 1",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new PickedPayload
                        {
                        Pick = "The_Nomad",
                        Type = "faction",
                        PlayerIndex = 0,
                        PlayerName = "Player 1",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new PickedPayload
                        {
                        Pick = "The_VuilRaith_Cabal",
                        Type = "faction",
                        PlayerIndex = 1,
                        PlayerName = "Player 2",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(SpeakerSelected),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new SpeakerSelectedPayload
                        {
                        SpeakerIndex = 1,
                        SpeakerName = "Player 2",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(CommitDraft),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new CommitDraftPayload
                        {
                        Factions = new string[] { "The_VuilRaith_Cabal", "The_Nomad" },
                        }, this.SerializerSettings),
                },
            };
            var expected = new List<TimelineEvent>()
            {
                new TimelineEvent
                {
                    Order = 0,
                    EventType = "GameStarted",
                    SerializedPayload = given[0].SerializedPayload,
                },
                new TimelineEvent
                {
                    Order = 1,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"0\",\"type\":\"tablePosition\",\"playerIndex\":1,\"playerName\":\"Player 2\"}",
                },
                new TimelineEvent
                {
                    Order = 2,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"1\",\"type\":\"tablePosition\",\"playerIndex\":0,\"playerName\":\"Player 1\"}",
                },
                new TimelineEvent
                {
                    Order = 3,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"The_Nomad\",\"type\":\"faction\",\"playerIndex\":0,\"playerName\":\"Player 1\"}",
                },
                new TimelineEvent
                {
                    Order = 4,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"The_VuilRaith_Cabal\",\"type\":\"faction\",\"playerIndex\":1,\"playerName\":\"Player 2\"}",
                },
                new TimelineEvent
                {
                    Order = 5,
                    EventType = "SpeakerSelected",
                    SerializedPayload = "{\"speakerIndex\":1,\"speakerName\":\"Player 2\"}",
                },
                new TimelineEvent
                {
                    Order = 6,
                    EventType = "CommitDraft",
                    SerializedPayload = "{\"factions\":[\"The_VuilRaith_Cabal\",\"The_Nomad\"],\"tablePositions\":[],\"initiative\":[]}",
                },
                new TimelineEvent
                {
                    Order = 7,
                    EventType = "DraftSummary",
                    SerializedPayload = "{\"speaker\":\"Player 2\",\"picks\":[{\"playerName\":\"Player 1\",\"faction\":\"The_Nomad\",\"tablePosition\":{\"name\":\"bbb\",\"color\":null}},{\"playerName\":\"Player 2\",\"faction\":\"The_VuilRaith_Cabal\",\"tablePosition\":{\"name\":\"aaa\",\"color\":null}}]}",
                },
            };
            var timeline = new Timeline(new Session { Events = given });

            // when
            var actual = timeline.AddDraftSummary().GetEvents();

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldAddDraftSummaryAfterDraftWithTablePositionHasBeenCommittedWithMultipleSpeakerDraws()
        {
            // given
            var given = new List<GameEvent>()
            {
                new GameEvent
                {
                    EventType = nameof(GameStarted),
                    SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload
                    {
                        Options = new DraftOptions
                        {
                            InitialPool = new string[] { "The_VuilRaith_Cabal", "The_Nomad" },
                            Players = new string[] { "Player 1", "Player 2" },
                            TablePick = true,
                        },
                    }),
                },
                new GameEvent
                {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new PickedPayload
                        {
                        Pick = "0",
                        Type = "tablePosition",
                        PlayerIndex = 1,
                        PlayerName = "Player 2",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new PickedPayload
                        {
                        Pick = "1",
                        Type = "tablePosition",
                        PlayerIndex = 0,
                        PlayerName = "Player 1",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new PickedPayload
                        {
                        Pick = "The_Nomad",
                        Type = "faction",
                        PlayerIndex = 0,
                        PlayerName = "Player 1",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new PickedPayload
                        {
                        Pick = "The_VuilRaith_Cabal",
                        Type = "faction",
                        PlayerIndex = 1,
                        PlayerName = "Player 2",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(SpeakerSelected),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new SpeakerSelectedPayload
                        {
                        SpeakerIndex = 1,
                        SpeakerName = "Player 2",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(SpeakerSelected),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new SpeakerSelectedPayload
                        {
                        SpeakerIndex = 0,
                        SpeakerName = "Player 1",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(CommitDraft),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new CommitDraftPayload
                        {
                        Factions = new string[] { "The_VuilRaith_Cabal", "The_Nomad" },
                        }, this.SerializerSettings),
                },
            };
            var expected = new List<TimelineEvent>()
            {
                new TimelineEvent
                {
                    Order = 0,
                    EventType = "GameStarted",
                    SerializedPayload = given[0].SerializedPayload,
                },
                new TimelineEvent
                {
                    Order = 1,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"0\",\"type\":\"tablePosition\",\"playerIndex\":1,\"playerName\":\"Player 2\"}",
                },
                new TimelineEvent
                {
                    Order = 2,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"1\",\"type\":\"tablePosition\",\"playerIndex\":0,\"playerName\":\"Player 1\"}",
                },
                new TimelineEvent
                {
                    Order = 3,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"The_Nomad\",\"type\":\"faction\",\"playerIndex\":0,\"playerName\":\"Player 1\"}",
                },
                new TimelineEvent
                {
                    Order = 4,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"The_VuilRaith_Cabal\",\"type\":\"faction\",\"playerIndex\":1,\"playerName\":\"Player 2\"}",
                },
                new TimelineEvent
                {
                    Order = 5,
                    EventType = "SpeakerSelected",
                    SerializedPayload = "{\"speakerIndex\":1,\"speakerName\":\"Player 2\"}",
                },
                new TimelineEvent
                {
                    Order = 6,
                    EventType = "SpeakerSelected",
                    SerializedPayload = "{\"speakerIndex\":0,\"speakerName\":\"Player 1\"}",
                },
                new TimelineEvent
                {
                    Order = 7,
                    EventType = "CommitDraft",
                    SerializedPayload = "{\"factions\":[\"The_VuilRaith_Cabal\",\"The_Nomad\"],\"tablePositions\":[],\"initiative\":[]}",
                },
                new TimelineEvent
                {
                    Order = 8,
                    EventType = "DraftSummary",
                    SerializedPayload = "{\"speaker\":\"Player 1\",\"picks\":[{\"playerName\":\"Player 1\",\"faction\":\"The_Nomad\",\"tablePosition\":{\"name\":\"1\",\"color\":null}},{\"playerName\":\"Player 2\",\"faction\":\"The_VuilRaith_Cabal\",\"tablePosition\":{\"name\":\"0\",\"color\":null}}]}",
                },
            };
            var timeline = new Timeline(new Session { Events = given });

            // when
            var actual = timeline.AddDraftSummary().GetEvents();

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldAddDraftSummaryWithNamedTablePositions()
        {
            // given
            var given = new List<GameEvent>()
            {
                new GameEvent
                {
                    EventType = nameof(GameStarted),
                    SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload
                    {
                        Options = new DraftOptions
                        {
                            InitialPool = new string[] { "The_VuilRaith_Cabal", "The_Nomad" },
                            Players = new string[] { "Player 1", "Player 2" },
                            MapPositions = new MapPosition[] { new MapPosition { Name = "NamedMapPosition1" }, new MapPosition { Name = "NamedMapPosition2" } },
                            TablePick = true,
                        },
                    }),
                },
                new GameEvent
                {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new PickedPayload
                        {
                        Pick = "0",
                        Type = "tablePosition",
                        PlayerIndex = 1,
                        PlayerName = "Player 2",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new PickedPayload
                        {
                        Pick = "1",
                        Type = "tablePosition",
                        PlayerIndex = 0,
                        PlayerName = "Player 1",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new PickedPayload
                        {
                        Pick = "The_Nomad",
                        Type = "faction",
                        PlayerIndex = 0,
                        PlayerName = "Player 1",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new PickedPayload
                        {
                        Pick = "The_VuilRaith_Cabal",
                        Type = "faction",
                        PlayerIndex = 1,
                        PlayerName = "Player 2",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(SpeakerSelected),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new SpeakerSelectedPayload
                        {
                        SpeakerIndex = 1,
                        SpeakerName = "Player 2",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(SpeakerSelected),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new SpeakerSelectedPayload
                        {
                        SpeakerIndex = 0,
                        SpeakerName = "Player 1",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(CommitDraft),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new CommitDraftPayload
                        {
                        Factions = new string[] { "The_VuilRaith_Cabal", "The_Nomad" },
                        }, this.SerializerSettings),
                },
            };
            var expected = new List<TimelineEvent>()
            {
                new TimelineEvent
                {
                    Order = 0,
                    EventType = "GameStarted",
                    SerializedPayload = given[0].SerializedPayload,
                },
                new TimelineEvent
                {
                    Order = 1,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"0\",\"type\":\"tablePosition\",\"playerIndex\":1,\"playerName\":\"Player 2\"}",
                },
                new TimelineEvent
                {
                    Order = 2,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"1\",\"type\":\"tablePosition\",\"playerIndex\":0,\"playerName\":\"Player 1\"}",
                },
                new TimelineEvent
                {
                    Order = 3,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"The_Nomad\",\"type\":\"faction\",\"playerIndex\":0,\"playerName\":\"Player 1\"}",
                },
                new TimelineEvent
                {
                    Order = 4,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"The_VuilRaith_Cabal\",\"type\":\"faction\",\"playerIndex\":1,\"playerName\":\"Player 2\"}",
                },
                new TimelineEvent
                {
                    Order = 5,
                    EventType = "SpeakerSelected",
                    SerializedPayload = "{\"speakerIndex\":1,\"speakerName\":\"Player 2\"}",
                },
                new TimelineEvent
                {
                    Order = 6,
                    EventType = "SpeakerSelected",
                    SerializedPayload = "{\"speakerIndex\":0,\"speakerName\":\"Player 1\"}",
                },
                new TimelineEvent
                {
                    Order = 7,
                    EventType = "CommitDraft",
                    SerializedPayload = "{\"factions\":[\"The_VuilRaith_Cabal\",\"The_Nomad\"],\"tablePositions\":[],\"initiative\":[]}",
                },
                new TimelineEvent
                {
                    Order = 8,
                    EventType = "DraftSummary",
                    SerializedPayload = "{\"speaker\":\"Player 1\",\"picks\":[{\"playerName\":\"Player 1\",\"faction\":\"The_Nomad\",\"tablePosition\":{\"name\":\"NamedMapPosition2\",\"color\":null}},{\"playerName\":\"Player 2\",\"faction\":\"The_VuilRaith_Cabal\",\"tablePosition\":{\"name\":\"NamedMapPosition1\",\"color\":null}}]}",
                },
            };
            var timeline = new Timeline(new Session { Events = given });

            // when
            var actual = timeline.AddDraftSummary().GetEvents();

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldAddDraftSummaryWithNamedTablePositionsAndColors()
        {
            // given
            var given = new List<GameEvent>()
            {
                new GameEvent
                {
                    EventType = nameof(GameStarted),
                    SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload
                    {
                        Options = new DraftOptions
                        {
                            InitialPool = new string[] { "The_VuilRaith_Cabal", "The_Nomad" },
                            Players = new string[] { "Player 1", "Player 2" },
                            MapPositions = new MapPosition[] { new MapPosition { Name = "NamedMapPosition1", Color = "Color1" }, new MapPosition { Name = "NamedMapPosition2", Color = "Color2" } },
                            TablePick = true,
                        },
                    }),
                },
                new GameEvent
                {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new PickedPayload
                        {
                        Pick = "0",
                        Type = "tablePosition",
                        PlayerIndex = 1,
                        PlayerName = "Player 2",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new PickedPayload
                        {
                        Pick = "1",
                        Type = "tablePosition",
                        PlayerIndex = 0,
                        PlayerName = "Player 1",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new PickedPayload
                        {
                        Pick = "The_Nomad",
                        Type = "faction",
                        PlayerIndex = 0,
                        PlayerName = "Player 1",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new PickedPayload
                        {
                        Pick = "The_VuilRaith_Cabal",
                        Type = "faction",
                        PlayerIndex = 1,
                        PlayerName = "Player 2",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(SpeakerSelected),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new SpeakerSelectedPayload
                        {
                        SpeakerIndex = 1,
                        SpeakerName = "Player 2",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(SpeakerSelected),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new SpeakerSelectedPayload
                        {
                        SpeakerIndex = 0,
                        SpeakerName = "Player 1",
                        }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(CommitDraft),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new CommitDraftPayload
                        {
                        Factions = new string[] { "The_VuilRaith_Cabal", "The_Nomad" },
                        }, this.SerializerSettings),
                },
            };
            var expected = new List<TimelineEvent>()
            {
                new TimelineEvent
                {
                    Order = 0,
                    EventType = "GameStarted",
                    SerializedPayload = given[0].SerializedPayload,
                },
                new TimelineEvent
                {
                    Order = 1,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"0\",\"type\":\"tablePosition\",\"playerIndex\":1,\"playerName\":\"Player 2\"}",
                },
                new TimelineEvent
                {
                    Order = 2,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"1\",\"type\":\"tablePosition\",\"playerIndex\":0,\"playerName\":\"Player 1\"}",
                },
                new TimelineEvent
                {
                    Order = 3,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"The_Nomad\",\"type\":\"faction\",\"playerIndex\":0,\"playerName\":\"Player 1\"}",
                },
                new TimelineEvent
                {
                    Order = 4,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"The_VuilRaith_Cabal\",\"type\":\"faction\",\"playerIndex\":1,\"playerName\":\"Player 2\"}",
                },
                new TimelineEvent
                {
                    Order = 5,
                    EventType = "SpeakerSelected",
                    SerializedPayload = "{\"speakerIndex\":1,\"speakerName\":\"Player 2\"}",
                },
                new TimelineEvent
                {
                    Order = 6,
                    EventType = "SpeakerSelected",
                    SerializedPayload = "{\"speakerIndex\":0,\"speakerName\":\"Player 1\"}",
                },
                new TimelineEvent
                {
                    Order = 7,
                    EventType = "CommitDraft",
                    SerializedPayload = "{\"factions\":[\"The_VuilRaith_Cabal\",\"The_Nomad\"],\"tablePositions\":[],\"initiative\":[]}",
                },
                new TimelineEvent
                {
                    Order = 8,
                    EventType = "DraftSummary",
                    SerializedPayload = "{\"speaker\":\"Player 1\",\"picks\":[{\"playerName\":\"Player 1\",\"faction\":\"The_Nomad\",\"tablePosition\":{\"name\":\"NamedMapPosition2\",\"color\":\"Color2\"}},{\"playerName\":\"Player 2\",\"faction\":\"The_VuilRaith_Cabal\",\"tablePosition\":{\"name\":\"NamedMapPosition1\",\"color\":\"Color1\"}}]}",
                },
            };
            var timeline = new Timeline(new Session { Events = given });

            // when
            var actual = timeline.AddDraftSummary().GetEvents();

            // then
            actual.Should().BeEquivalentTo(expected);
        }
    }
}
