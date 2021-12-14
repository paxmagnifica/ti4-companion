using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;
using FluentAssertions;
using server.Domain;

namespace serverTests
{
    public class DraftSummary
    {
        [Test]
        public void ShouldReturnEmptyIfPassedEmpty()
        {
            // given
            var given = new List<TimelineEvent>();
            ITimelineModifiers timelineModifiers = new TimelineModifiers();

            // when
            var actual = timelineModifiers.AddDraftSummary(given);

            // then
            Assert.AreEqual(0, actual.Count());
        }

        [Test]
        public void ShouldAddDraftSummaryAfterDraftWithOnlyFactionPicksHasBeenCommitted()
        {
            // given
            var given = new List<TimelineEvent>() {
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
            };
            var expected = new List<TimelineEvent>(given);
            expected.Add(
                new TimelineEvent {
                    Order = 4,
                    EventType = "DraftSummary",
                    SerializedPayload = "{\"speaker\":\"Player 2\",\"picks\":[{\"playerName\":\"Player 1\",\"faction\":\"The_Nomad\",\"tablePosition\":-1},{\"playerName\":\"Player 2\",\"faction\":\"The_VuilRaith_Cabal\",\"tablePosition\":-1}]}"
                }
            );
            ITimelineModifiers timelineModifiers = new TimelineModifiers();

            // when
            var actual = timelineModifiers.AddDraftSummary(given);

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldAddDraftSummaryAfterDraftWithTablePositionHasBeenCommitted()
        {
            // given
            var given = new List<TimelineEvent>() {
                new TimelineEvent {
                    Order = 0,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":0,\"type\":\"tablePosition\",\"playerIndex\":1,\"playerName\":\"Player 2\"}"
                },
                new TimelineEvent {
                    Order = 1,
                    EventType = "Picked",
                    SerializedPayload = "{\"pick\":1,\"type\":\"tablePosition\",\"playerIndex\":0,\"playerName\":\"Player 1\"}"
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
                    SerializedPayload = "{\"speakerIndex\":3,\"speakerName\":\"Player 2\"}"
                },
                new TimelineEvent {
                    Order = 5,
                    EventType = "CommitDraft",
                    SerializedPayload = "{\"factions\":[\"The_VuilRaith_Cabal\",\"The_Nomad\"]}"
                },
            };
            var expected = new List<TimelineEvent>(given);
            expected.Add(
                new TimelineEvent {
                    Order = 6,
                    EventType = "DraftSummary",
                    SerializedPayload = "{\"speaker\":\"Player 2\",\"picks\":[{\"playerName\":\"Player 1\",\"faction\":\"The_Nomad\",\"tablePosition\":1},{\"playerName\":\"Player 2\",\"faction\":\"The_VuilRaith_Cabal\",\"tablePosition\":0}]}"
                }
            );
            ITimelineModifiers timelineModifiers = new TimelineModifiers();

            // when
            var actual = timelineModifiers.AddDraftSummary(given);

            // then
            actual.Should().BeEquivalentTo(expected);
        }
    }
}
