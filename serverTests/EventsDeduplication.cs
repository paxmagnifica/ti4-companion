using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;
using FluentAssertions;
using server.Domain;

namespace serverTests
{
    public class EventsDeduplication
    {
        [Test]
        public void ShouldReturnEmptyEventsIfPassedEmpty()
        {
            // given
            var given = new List<TimelineEvent>();
            ITimelineModifiers timelineModifiers = new TimelineModifiers();

            // when
            var actual = timelineModifiers.Deduplicate(given);

            // then
            Assert.AreEqual(0, actual.Count());
        }

        [Test]
        public void ShouldNotCrashOnSingleEventList()
        {
            // given
            var given = new List<TimelineEvent>() {
                new TimelineEvent {
                    Order = 0,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"sessionId\":\"63747d3c-626d-4f35-a948-8fa66c4b8368\",\"faction\":\"The_Universities_of_Jol__Nar\",\"points\":1}"
                },
            };
            var expected = new List<TimelineEvent>() {
                new TimelineEvent {
                    Order = 0,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"sessionId\":\"63747d3c-626d-4f35-a948-8fa66c4b8368\",\"faction\":\"The_Universities_of_Jol__Nar\",\"points\":1}"
                },
            };

            ITimelineModifiers timelineModifiers = new TimelineModifiers();

            // when
            var actual = timelineModifiers.Deduplicate(given);

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldSkipTwoConsecutiveVPEventsThatCancelEachOtherOut()
        {
            // given
            var given = new List<TimelineEvent>() {
                new TimelineEvent {
                    Order = 0,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"sessionId\":\"63747d3c-626d-4f35-a948-8fa66c4b8368\",\"faction\":\"The_Universities_of_Jol__Nar\",\"points\":1}"
                },
                new TimelineEvent {
                    Order = 1,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"sessionId\":\"63747d3c-626d-4f35-a948-8fa66c4b8368\",\"faction\":\"The_Universities_of_Jol__Nar\",\"points\":0}"
                },
                new TimelineEvent {
                    Order = 2,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"sessionId\":\"63747d3c-626d-4f35-a948-8fa66c4b8368\",\"faction\":\"The_Xxcha_Kingdom\",\"points\":1}"
                }
            };
            var expected = new List<TimelineEvent>() {
                new TimelineEvent {
                    Order = 0,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"sessionId\":\"63747d3c-626d-4f35-a948-8fa66c4b8368\",\"faction\":\"The_Xxcha_Kingdom\",\"points\":1}"
                }
            };

            ITimelineModifiers timelineModifiers = new TimelineModifiers();

            // when
            var actual = timelineModifiers.Deduplicate(given);

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldNotDeduplicateVPChangesIfSomethingWasInBetween()
        {
            // given
            var given = new List<TimelineEvent>() {
                new TimelineEvent {
                    Order = 0,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"sessionId\":\"63747d3c-626d-4f35-a948-8fa66c4b8368\",\"faction\":\"The_Universities_of_Jol__Nar\",\"points\":1}"
                },
                new TimelineEvent {
                    Order = 1,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"sessionId\":\"63747d3c-626d-4f35-a948-8fa66c4b8368\",\"faction\":\"The_Xxcha_Kingdom\",\"points\":1}"
                },
                new TimelineEvent {
                    Order = 2,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"sessionId\":\"63747d3c-626d-4f35-a948-8fa66c4b8368\",\"faction\":\"The_Universities_of_Jol__Nar\",\"points\":0}"
                },
            };
            var expected = new List<TimelineEvent>() {
                new TimelineEvent {
                    Order = 0,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"sessionId\":\"63747d3c-626d-4f35-a948-8fa66c4b8368\",\"faction\":\"The_Universities_of_Jol__Nar\",\"points\":1}"
                },
                new TimelineEvent {
                    Order = 1,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"sessionId\":\"63747d3c-626d-4f35-a948-8fa66c4b8368\",\"faction\":\"The_Xxcha_Kingdom\",\"points\":1}"
                },
                new TimelineEvent {
                    Order = 2,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"sessionId\":\"63747d3c-626d-4f35-a948-8fa66c4b8368\",\"faction\":\"The_Universities_of_Jol__Nar\",\"points\":0}"
                },
            };

            ITimelineModifiers timelineModifiers = new TimelineModifiers();

            // when
            var actual = timelineModifiers.Deduplicate(given);

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldDeduplicateScoredDescoredObjectivesForTheSameObjAndFaction()
        {
            // given
            var given = new List<TimelineEvent> {
                new TimelineEvent {
                    Order = 0,
                    EventType = "ObjectiveAdded",
                    SerializedPayload = "{\"sessionId\":\"1811a152-b64c-41cd-bdfd-8885fdfb7620\",\"slug\":\"raise-a-fleet\"}",
                },
                new TimelineEvent {
                    Order = 1,
                    EventType = "ObjectiveScored",
                    SerializedPayload = "{\"faction\":\"The_Universities_of_Jol__Nar\",\"points\":0,\"slug\":\"raise-a-fleet\"}",
                },
                new TimelineEvent {
                    Order = 2,
                    EventType = "ObjectiveScored",
                    SerializedPayload = "{\"faction\":\"The_Emirates_of_Hacan\",\"points\":0,\"slug\":\"raise-a-fleet\"}",
                },
                new TimelineEvent {
                    Order = 3,
                    EventType = "ObjectiveDescored",
                    SerializedPayload = "{\"sessionId\":\"1811a152-b64c-41cd-bdfd-8885fdfb7620\",\"slug\":\"raise-a-fleet\",\"faction\":\"The_Emirates_of_Hacan\"}",
                },
            };

            var expected = new List<TimelineEvent> {
                new TimelineEvent {
                    Order = 0,
                    EventType = "ObjectiveAdded",
                    SerializedPayload = "{\"sessionId\":\"1811a152-b64c-41cd-bdfd-8885fdfb7620\",\"slug\":\"raise-a-fleet\"}",
                },
                new TimelineEvent {
                    Order = 1,
                    EventType = "ObjectiveScored",
                    SerializedPayload = "{\"faction\":\"The_Universities_of_Jol__Nar\",\"points\":0,\"slug\":\"raise-a-fleet\"}",
                },
            };

            ITimelineModifiers timelineModifiers = new TimelineModifiers();

            // when
            var actual = timelineModifiers.Deduplicate(given);

            // then
            actual.Should().BeEquivalentTo(expected);
        }
    }
}
