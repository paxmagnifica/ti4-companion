using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
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
            ITimelineDeduplication timelineDeduplication = new TimelineDeduplication();

            // when
            var actual = timelineDeduplication.Deduplicate(given);

            // then
            Assert.AreEqual(0, actual.Count());
        }

        [Test]
        public void ShouldSkipTwoConsecutiveVPEventsThatCancelEachOtherOut()
        {
            // given
            var given = new List<TimelineEvent>() {
                new TimelineEvent {
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"sessionId\":\"63747d3c-626d-4f35-a948-8fa66c4b8368\",\"faction\":\"The_Universities_of_Jol__Nar\",\"points\":1}"
                },
                new TimelineEvent {
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"sessionId\":\"63747d3c-626d-4f35-a948-8fa66c4b8368\",\"faction\":\"The_Universities_of_Jol__Nar\",\"points\":0}"
                },
                new TimelineEvent {
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"sessionId\":\"63747d3c-626d-4f35-a948-8fa66c4b8368\",\"faction\":\"The_Xxcha_Kingdom\",\"points\":1}"
                }
            };
            var expected = new List<TimelineEvent>() {
                new TimelineEvent {
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"sessionId\":\"63747d3c-626d-4f35-a948-8fa66c4b8368\",\"faction\":\"The_Xxcha_Kingdom\",\"points\":1}"
                }
            };

            ITimelineDeduplication timelineDeduplication = new TimelineDeduplication();

            // when
            var actual = timelineDeduplication.Deduplicate(given);

            // then
            Console.WriteLine(JsonConvert.SerializeObject(actual));
            actual.Should().BeEquivalentTo(actual);
        }
    }
}
