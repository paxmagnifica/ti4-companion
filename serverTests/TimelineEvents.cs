using FluentAssertions;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using NUnit.Framework;
using server.Domain;
using System.Collections.Generic;

namespace ServerTests
{
    public class TimelineEvents
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
        public void ShouldIncludeVictoryPointsInObjectiveScoredTimelineEvent()
        {
            // given
            var given = new List<GameEvent>()
            {
                new GameEvent
                {
                    EventType = nameof(ObjectiveAdded),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new ObjectiveAddedPayload
                    {
                            Slug = "raise-a-fleet"
                            }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(ObjectiveScored),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new ObjectiveScoredPayload
                    {
                            Faction = "The_Universities_of_Jol__Nar",
                            Slug = "raise-a-fleet",
                            Points = 1
                            }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Universities_of_Jol__Nar",
                            Points = 1
                            }, this.SerializerSettings),
                },
            };

            var expected = new List<TimelineEvent>
            {
                new TimelineEvent
                {
                    Order = 0,
                    EventType = "ObjectiveAdded",
                    SerializedPayload = "{\"slug\":\"raise-a-fleet\"}",
                },
                new TimelineEvent
                {
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
            var given = new List<GameEvent>()
            {
                new GameEvent
                {
                    EventType = nameof(ObjectiveAdded),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new ObjectiveAddedPayload
                    {
                            Slug = "raise-a-fleet"
                            }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Universities_of_Jol__Nar",
                            Points = 1
                            }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(ObjectiveScored),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new ObjectiveScoredPayload
                    {
                            Faction = "The_Universities_of_Jol__Nar",
                            Slug = "raise-a-fleet",
                            Points = 2
                            }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Universities_of_Jol__Nar",
                            Points = 2
                            }, this.SerializerSettings),
                },
            };

            var expected = new List<TimelineEvent>
            {
                new TimelineEvent
                {
                    Order = 0,
                    EventType = "ObjectiveAdded",
                    SerializedPayload = "{\"slug\":\"raise-a-fleet\"}",
                },
                new TimelineEvent
                {
                    Order = 1,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Universities_of_Jol__Nar\",\"points\":1,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
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
