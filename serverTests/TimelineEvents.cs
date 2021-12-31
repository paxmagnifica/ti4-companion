using System.Collections.Generic;
using NUnit.Framework;
using FluentAssertions;
using server.Domain;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace serverTests
{
    public class TimelineEvents
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
        public void ShouldIncludeVictoryPointsInObjectiveScoredTimelineEvent()
        {
            // given
            var given = new List<GameEvent>() {
                new GameEvent {
                    EventType = nameof(ObjectiveAdded),
                    SerializedPayload = JsonConvert.SerializeObject(new ObjectiveAddedPayload {
                            Slug = "raise-a-fleet"
                            }, SerializerSettings)
                },
                new GameEvent {
                    EventType = nameof(ObjectiveScored),
                    SerializedPayload = JsonConvert.SerializeObject(new ObjectiveScoredPayload {
                            Faction = "The_Universities_of_Jol__Nar",
                            Slug = "raise-a-fleet",
                            Points = 1
                            }, SerializerSettings)
                },
                new GameEvent {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(new VictoryPointsUpdatedPayload {
                            Faction = "The_Universities_of_Jol__Nar",
                            Points = 1
                            }, SerializerSettings)
                },
            };

            var expected = new List<TimelineEvent> {
                new TimelineEvent {
                    Order = 0,
                    EventType = "ObjectiveAdded",
                    SerializedPayload = "{\"slug\":\"raise-a-fleet\"}",
                },
                new TimelineEvent {
                    Order = 1,
                    EventType = "ObjectiveScored",
                    SerializedPayload = "{\"slug\":\"raise-a-fleet\",\"faction\":\"The_Universities_of_Jol__Nar\",\"points\":1}",
                },
            };

            var timeline = new Timeline(new Session { Events = given });

            // when
            var actual = timeline.GetEvents();

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldIncludeLatestVictoryPointsUpdatedWithObjectiveScored()
        {
            // given
            var given = new List<GameEvent>() {
                new GameEvent {
                    EventType = nameof(ObjectiveAdded),
                    SerializedPayload = JsonConvert.SerializeObject(new ObjectiveAddedPayload {
                            Slug = "raise-a-fleet"
                            }, SerializerSettings)
                },
                new GameEvent {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(new VictoryPointsUpdatedPayload {
                            Faction = "The_Universities_of_Jol__Nar",
                            Points = 1
                            }, SerializerSettings)
                },
                new GameEvent {
                    EventType = nameof(ObjectiveScored),
                    SerializedPayload = JsonConvert.SerializeObject(new ObjectiveScoredPayload {
                            Faction = "The_Universities_of_Jol__Nar",
                            Slug = "raise-a-fleet",
                            Points = 2
                            }, SerializerSettings)
                },
                new GameEvent {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(new VictoryPointsUpdatedPayload {
                            Faction = "The_Universities_of_Jol__Nar",
                            Points = 2
                            }, SerializerSettings)
                },
            };

            var expected = new List<TimelineEvent> {
                new TimelineEvent {
                    Order = 0,
                    EventType = "ObjectiveAdded",
                    SerializedPayload = "{\"slug\":\"raise-a-fleet\"}",
                },
                new TimelineEvent {
                    Order = 1,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Universities_of_Jol__Nar\",\"points\":1}"
                },
                new TimelineEvent {
                    Order = 2,
                    EventType = "ObjectiveScored",
                    SerializedPayload = "{\"slug\":\"raise-a-fleet\",\"faction\":\"The_Universities_of_Jol__Nar\",\"points\":2}",
                },
            };

            var timeline = new Timeline(new Session { Events = given });

            // when
            var actual = timeline.GetEvents();

            // then
            actual.Should().BeEquivalentTo(expected);
        }
    }
}
