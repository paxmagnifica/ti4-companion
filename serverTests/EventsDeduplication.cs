using FluentAssertions;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using NUnit.Framework;
using Server.Domain;
using System.Collections.Generic;
using System.Linq;

namespace ServerTests
{
    public class EventsDeduplication
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
        public void ShouldReturnEmptyEventsIfPassedEmpty()
        {
            // given
            var given = new List<GameEvent>();
            var timeline = new Timeline(new Session { Events = given });

            // when
            var actual = timeline.Deduplicate().GetEvents();

            // then
            Assert.AreEqual(0, actual.Count());
        }

        [Test]
        public void ShouldNotCrashOnSingleEventList()
        {
            // given
            var given = new List<GameEvent>()
            {
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Universities_of_Jol__Nar",
                            Points = 1,
                    }, this.SerializerSettings),
                },
            };
            var expected = new List<TimelineEvent>()
            {
                new TimelineEvent
                {
                    Order = 0,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Universities_of_Jol__Nar\",\"points\":1,\"source\":0,\"context\":null}",
                },
            };

            var timeline = new Timeline(new Session { Events = given });

            // when
            var actual = timeline.Deduplicate().GetEvents();

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldSkipTwoConsecutiveVPEventsThatCancelEachOtherOut()
        {
            // given
            var given = new List<GameEvent>()
            {
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Universities_of_Jol__Nar",
                            Points = 1,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Universities_of_Jol__Nar",
                            Points = 0,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Xxcha_Kingdom",
                            Points = 1,
                    }, this.SerializerSettings),
                },
            };
            var expected = new List<TimelineEvent>()
            {
                new TimelineEvent
                {
                    Order = 0,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Xxcha_Kingdom\",\"points\":1,\"source\":0,\"context\":null}",
                },
            };

            var timeline = new Timeline(new Session { Events = given });

            // when
            var actual = timeline.Deduplicate().GetEvents();

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldNotDeduplicateVPChangesIfSomethingWasInBetween()
        {
            // given
            var given = new List<GameEvent>()
            {
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Universities_of_Jol__Nar",
                            Points = 1,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Xxcha_Kingdom",
                            Points = 1,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Universities_of_Jol__Nar",
                            Points = 0,
                    }, this.SerializerSettings),
                },
            };
            var expected = new List<TimelineEvent>()
            {
                new TimelineEvent
                {
                    Order = 0,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Universities_of_Jol__Nar\",\"points\":1,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 1,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Xxcha_Kingdom\",\"points\":1,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 2,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Universities_of_Jol__Nar\",\"points\":0,\"source\":0,\"context\":null}",
                },
            };

            var timeline = new Timeline(new Session { Events = given });

            // when
            var actual = timeline.Deduplicate().GetEvents();

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldDeduplicateScoredDescoredObjectivesForTheSameObjAndFaction()
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
                            Slug = "raise-a-fleet",
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
                            Points = 1,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Universities_of_Jol__Nar",
                            Points = 1,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(ObjectiveScored),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new ObjectiveScoredPayload
                    {
                            Faction = "The_Emirates_of_Hacan",
                            Slug = "raise-a-fleet",
                            Points = 1,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Emirates_of_Hacan",
                            Points = 1,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(ObjectiveDescored),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new ObjectiveDescoredPayload
                    {
                            Faction = "The_Emirates_of_Hacan",
                            Slug = "raise-a-fleet",
                            Points = 0,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Emirates_of_Hacan",
                            Points = 0,
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
            var actual = timeline.Deduplicate().GetEvents();

            // then
            actual.Should().BeEquivalentTo(expected);
        }
    }
}
