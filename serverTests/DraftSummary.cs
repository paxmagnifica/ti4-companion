using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;
using FluentAssertions;
using server.Domain;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace serverTests
{
    public class DraftSummary
    {
        JsonSerializerSettings SerializerSettings
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
            var sessionEvents = new List<GameEvent>() {
                new GameEvent {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(new PickedPayload {
                        Pick = "The_Nomad",
                        Type = "faction",
                        PlayerIndex = 0,
                        PlayerName = "Player 1"
                    }, SerializerSettings)
                },
                new GameEvent {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(new PickedPayload {
                        Pick = "The_VuilRaith_Cabal",
                        Type = "faction",
                        PlayerIndex = 1,
                        PlayerName = "Player 2"
                    }, SerializerSettings)
                },
                new GameEvent {
                    EventType = nameof(SpeakerSelected),
                    SerializedPayload = JsonConvert.SerializeObject(new SpeakerSelectedPayload {
                        SpeakerIndex = 3,
                        SpeakerName = "Player 2"
                    }, SerializerSettings)
                },
                new GameEvent {
                    EventType = nameof(CommitDraft),
                    SerializedPayload = JsonConvert.SerializeObject(new CommitDraftPayload {
                        Factions = new string[] {"The_VuilRaith_Cabal", "The_Nomad"}
                    }, SerializerSettings)
                },
            };
            var expected = new List<TimelineEvent>() {
                new TimelineEvent {
                    Order = 0,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"The_Nomad\",\"type\":\"faction\",\"playerIndex\":0,\"playerName\":\"Player 1\"}"
                },
                new TimelineEvent {
                    Order = 1,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"The_VuilRaith_Cabal\",\"type\":\"faction\",\"playerIndex\":1,\"playerName\":\"Player 2\"}"
                },
                new TimelineEvent {
                    Order = 2,
                    EventType = "SpeakerSelected",
                    SerializedPayload = "{\"speakerIndex\":3,\"speakerName\":\"Player 2\"}"
                },
                new TimelineEvent {
                    Order = 3,
                    EventType = "CommitDraft",
                    SerializedPayload = "{\"factions\":[\"The_VuilRaith_Cabal\",\"The_Nomad\"]}"
                },
                new TimelineEvent
                {
                    Order = 4,
                    EventType = "DraftSummary",
                    SerializedPayload = "{\"speaker\":\"Player 2\",\"picks\":[{\"playerName\":\"Player 1\",\"faction\":\"The_Nomad\",\"tablePosition\":-1},{\"playerName\":\"Player 2\",\"faction\":\"The_VuilRaith_Cabal\",\"tablePosition\":-1}]}"
                }
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
            var given = new List<GameEvent>() {
                 new GameEvent {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(new PickedPayload {
                        Pick = "0",
                        Type = "tablePosition",
                        PlayerIndex = 1,
                        PlayerName = "Player 2"
                    }, SerializerSettings)
                },
                new GameEvent {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(new PickedPayload {
                        Pick = "1",
                        Type = "tablePosition",
                        PlayerIndex = 0,
                        PlayerName = "Player 1"
                    }, SerializerSettings)
                },
                 new GameEvent {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(new PickedPayload {
                        Pick = "The_Nomad",
                        Type = "faction",
                        PlayerIndex = 0,
                        PlayerName = "Player 1"
                    }, SerializerSettings)
                },
                new GameEvent {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(new PickedPayload {
                        Pick = "The_VuilRaith_Cabal",
                        Type = "faction",
                        PlayerIndex = 1,
                        PlayerName = "Player 2"
                    }, SerializerSettings)
                },
                new GameEvent {
                    EventType = nameof(SpeakerSelected),
                    SerializedPayload = JsonConvert.SerializeObject(new SpeakerSelectedPayload {
                        SpeakerIndex = 1,
                        SpeakerName = "Player 2"
                    }, SerializerSettings)
                },
                new GameEvent {
                    EventType = nameof(CommitDraft),
                    SerializedPayload = JsonConvert.SerializeObject(new CommitDraftPayload {
                        Factions = new string[] {"The_VuilRaith_Cabal", "The_Nomad"}
                    }, SerializerSettings)
                },
           };
            var expected = new List<TimelineEvent>() {
                new TimelineEvent {
                    Order = 0,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"0\",\"type\":\"tablePosition\",\"playerIndex\":1,\"playerName\":\"Player 2\"}"
                },
                new TimelineEvent {
                    Order = 1,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"1\",\"type\":\"tablePosition\",\"playerIndex\":0,\"playerName\":\"Player 1\"}"
                },
                new TimelineEvent {
                    Order = 2,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"The_Nomad\",\"type\":\"faction\",\"playerIndex\":0,\"playerName\":\"Player 1\"}"
                },
                new TimelineEvent {
                    Order = 3,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"The_VuilRaith_Cabal\",\"type\":\"faction\",\"playerIndex\":1,\"playerName\":\"Player 2\"}"
                },
                new TimelineEvent {
                    Order = 4,
                    EventType = "SpeakerSelected",
                    SerializedPayload = "{\"speakerIndex\":1,\"speakerName\":\"Player 2\"}"
                },
                new TimelineEvent {
                    Order = 5,
                    EventType = "CommitDraft",
                    SerializedPayload = "{\"factions\":[\"The_VuilRaith_Cabal\",\"The_Nomad\"]}"
                },
                new TimelineEvent
                {
                    Order = 6,
                    EventType = "DraftSummary",
                    SerializedPayload = "{\"speaker\":\"Player 2\",\"picks\":[{\"playerName\":\"Player 1\",\"faction\":\"The_Nomad\",\"tablePosition\":1},{\"playerName\":\"Player 2\",\"faction\":\"The_VuilRaith_Cabal\",\"tablePosition\":0}]}"
                }
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
            var given = new List<GameEvent>() {
                 new GameEvent {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(new PickedPayload {
                        Pick = "0",
                        Type = "tablePosition",
                        PlayerIndex = 1,
                        PlayerName = "Player 2"
                    }, SerializerSettings)
                },
                new GameEvent {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(new PickedPayload {
                        Pick = "1",
                        Type = "tablePosition",
                        PlayerIndex = 0,
                        PlayerName = "Player 1"
                    }, SerializerSettings)
                },
                 new GameEvent {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(new PickedPayload {
                        Pick = "The_Nomad",
                        Type = "faction",
                        PlayerIndex = 0,
                        PlayerName = "Player 1"
                    }, SerializerSettings)
                },
                new GameEvent {
                    EventType = nameof(Picked),
                    SerializedPayload = JsonConvert.SerializeObject(new PickedPayload {
                        Pick = "The_VuilRaith_Cabal",
                        Type = "faction",
                        PlayerIndex = 1,
                        PlayerName = "Player 2"
                    }, SerializerSettings)
                },
                new GameEvent {
                    EventType = nameof(SpeakerSelected),
                    SerializedPayload = JsonConvert.SerializeObject(new SpeakerSelectedPayload {
                        SpeakerIndex = 1,
                        SpeakerName = "Player 2"
                    }, SerializerSettings)
                },
                new GameEvent {
                    EventType = nameof(SpeakerSelected),
                    SerializedPayload = JsonConvert.SerializeObject(new SpeakerSelectedPayload {
                        SpeakerIndex = 0,
                        SpeakerName = "Player 1"
                    }, SerializerSettings)
                },
                new GameEvent {
                    EventType = nameof(CommitDraft),
                    SerializedPayload = JsonConvert.SerializeObject(new CommitDraftPayload {
                        Factions = new string[] {"The_VuilRaith_Cabal", "The_Nomad"}
                    }, SerializerSettings)
                },
           };
            var expected = new List<TimelineEvent>() {
                new TimelineEvent {
                    Order = 0,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"0\",\"type\":\"tablePosition\",\"playerIndex\":1,\"playerName\":\"Player 2\"}"
                },
                new TimelineEvent {
                    Order = 1,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"1\",\"type\":\"tablePosition\",\"playerIndex\":0,\"playerName\":\"Player 1\"}"
                },
                new TimelineEvent {
                    Order = 2,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"The_Nomad\",\"type\":\"faction\",\"playerIndex\":0,\"playerName\":\"Player 1\"}"
                },
                new TimelineEvent {
                    Order = 3,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":\"The_VuilRaith_Cabal\",\"type\":\"faction\",\"playerIndex\":1,\"playerName\":\"Player 2\"}"
                },
                new TimelineEvent {
                    Order = 4,
                    EventType = "SpeakerSelected",
                    SerializedPayload = "{\"speakerIndex\":1,\"speakerName\":\"Player 2\"}"
                },
                new TimelineEvent {
                    Order = 5,
                    EventType = "SpeakerSelected",
                    SerializedPayload = "{\"speakerIndex\":0,\"speakerName\":\"Player 1\"}"
                },
                new TimelineEvent {
                    Order = 6,
                    EventType = "CommitDraft",
                    SerializedPayload = "{\"factions\":[\"The_VuilRaith_Cabal\",\"The_Nomad\"]}"
                },
                new TimelineEvent
                {
                    Order = 7,
                    EventType = "DraftSummary",
                    SerializedPayload = "{\"speaker\":\"Player 1\",\"picks\":[{\"playerName\":\"Player 1\",\"faction\":\"The_Nomad\",\"tablePosition\":1},{\"playerName\":\"Player 2\",\"faction\":\"The_VuilRaith_Cabal\",\"tablePosition\":0}]}"
                }
            };
            var timeline = new Timeline(new Session { Events = given });

            // when
            var actual = timeline.AddDraftSummary().GetEvents();

            // then
            actual.Should().BeEquivalentTo(expected);
        }
    }
}
