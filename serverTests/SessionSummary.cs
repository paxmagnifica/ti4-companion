using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;
using FluentAssertions;
using server.Domain;
using Newtonsoft.Json;

namespace serverTests
{
    public class SessionSummary
    {
        [Test]
        public void ShouldIncludeResultsInSessionSummaryForDefaultVPCount()
        {
            // given
            var given = new List<TimelineEvent>() {
                new TimelineEvent {
                    Order = 0,
                    EventType = "CommitDraft",
                    SerializedPayload = "{\"factions\":[\"The_Nekro_Virus\",\"Sardakk_Norr\",\"The_Winnu\",\"The_Xxcha_Kingdom\"]}"
                },
                new TimelineEvent {
                    Order = 1,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"sessionId\":\"9b486508-f1b9-4831-a371-88aaae6864a7\",\"faction\":\"The_Xxcha_Kindgom\",\"points\":1}"
                },
                new TimelineEvent {
                    Order = 2,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"sessionId\":\"9b486508-f1b9-4831-a371-88aaae6864a7\",\"faction\":\"The_Nekro_Virus\",\"points\":4}"
                },
                new TimelineEvent {
                    Order = 3,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"sessionId\":\"9b486508-f1b9-4831-a371-88aaae6864a7\",\"faction\":\"Sardakk_Norr\",\"points\":2}"
                },
                new TimelineEvent {
                    Order = 4,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"sessionId\":\"9b486508-f1b9-4831-a371-88aaae6864a7\",\"faction\":\"The_Winnu\",\"points\":10}"
                }
            };
            var expected = new List<TimelineEvent>(given) {
                new TimelineEvent {
                    Order = 5,
                    EventType = "SessionSummary",
                    SerializedPayload = "{\"winner\":\"The_Winnu\",\"results\":[{\"faction\":\"The_Xxcha_Kindgom\",\"points\":1},{\"faction\":\"The_Nekro_Virus\",\"points\":4},{\"faction\":\"Sardakk_Norr\",\"points\":2},{\"faction\":\"The_Winnu\",\"points\":10}]}"
                }
            };
            ITimelineModifiers timelineModifiers = new TimelineModifiers();

            // when
            var actual = timelineModifiers.AddSessionSummary(given);

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldNotIncludeSessionSummaryIfNoOneWonYet()
        {
            // given
            var given = new List<TimelineEvent>() {
                new TimelineEvent {
                    Order = 0,
                    EventType = "CommitDraft",
                    SerializedPayload = "{\"factions\":[\"The_Nekro_Virus\",\"Sardakk_Norr\",\"The_Winnu\",\"The_Xxcha_Kingdom\",\"The_Ghosts_of_Creuss\",\"The_Barony_of_Letnev\"]}"
                },
                new TimelineEvent {
                    Order = 1,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"sessionId\":\"9b486508-f1b9-4831-a371-88aaae6864a7\",\"faction\":\"The_Xxcha_Kindgom\",\"points\":1}"
                }
            };
            var expected = new List<TimelineEvent>(given);
            ITimelineModifiers timelineModifiers = new TimelineModifiers();

            // when
            var actual = timelineModifiers.AddSessionSummary(given);

            // then
            actual.Should().BeEquivalentTo(expected);
        }
    }
}
