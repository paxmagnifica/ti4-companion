using FluentAssertions;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using NUnit.Framework;
using Server.Domain;
using System.Collections.Generic;

namespace ServerTests
{
    public class SessionSummary
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
        public void ShouldIncludeResultsInSessionSummaryForDefaultVPCount()
        {
            // given
            var given = new List<GameEvent>()
            {
                new GameEvent
                {
                    EventType = nameof(CommitDraft),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new CommitDraftPayload
                    {
                        Factions = new string[] { "The_Nekro_Virus", "Sardakk_Norr", "The_Winnu", "The_Xxcha_Kingdom" },
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
                            Faction = "The_Nekro_Virus",
                            Points = 4,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "Sardakk_Norr",
                            Points = 2,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Winnu",
                            Points = 10,
                    }, this.SerializerSettings),
                },
            };
            var expected = new List<TimelineEvent>()
            {
                new TimelineEvent
                {
                    Order = 0,
                    EventType = "CommitDraft",
                    SerializedPayload = "{\"factions\":[\"The_Nekro_Virus\",\"Sardakk_Norr\",\"The_Winnu\",\"The_Xxcha_Kingdom\"],\"tablePositions\":[],\"initiative\":[]}",
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
                    SerializedPayload = "{\"faction\":\"The_Nekro_Virus\",\"points\":4,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 3,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"Sardakk_Norr\",\"points\":2,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 4,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Winnu\",\"points\":10,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 5,
                    EventType = "SessionSummary",
                    SerializedPayload = "{\"winner\":\"The_Winnu\",\"results\":[{\"faction\":\"The_Xxcha_Kingdom\",\"points\":1},{\"faction\":\"The_Nekro_Virus\",\"points\":4},{\"faction\":\"Sardakk_Norr\",\"points\":2},{\"faction\":\"The_Winnu\",\"points\":10}]}",
                },
            };
            var timeline = new Timeline(new Session { Events = given });

            // when
            var actual = timeline.AddSessionSummary().GetEvents();

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldIncludeSessionSummaryIfLastVictoryPointIsByObjective()
        {
            // given
            var given = new List<GameEvent>()
            {
                new GameEvent
                {
                    EventType = nameof(CommitDraft),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new CommitDraftPayload
                    {
                        Factions = new string[] { "The_Nekro_Virus", "Sardakk_Norr", "The_Winnu", "The_Xxcha_Kingdom" },
                    }, this.SerializerSettings),
                },
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
                            Faction = "The_Nekro_Virus",
                            Points = 4,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "Sardakk_Norr",
                            Points = 2,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Winnu",
                            Points = 9,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "Sardakk_Norr",
                            Points = 3,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(ObjectiveScored),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new ObjectiveScoredPayload
                    {
                            Faction = "The_Winnu",
                            Slug = "raise-a-fleet",
                            Points = 10,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Winnu",
                            Points = 10,
                    }, this.SerializerSettings),
                },
            };
            var expected = new List<TimelineEvent>()
            {
                new TimelineEvent
                {
                    Order = 0,
                    EventType = "CommitDraft",
                    SerializedPayload = "{\"factions\":[\"The_Nekro_Virus\",\"Sardakk_Norr\",\"The_Winnu\",\"The_Xxcha_Kingdom\"],\"tablePositions\":[],\"initiative\":[]}",
                },
                new TimelineEvent
                {
                    Order = 1,
                    EventType = "ObjectiveAdded",
                    SerializedPayload = "{\"slug\":\"raise-a-fleet\"}",
                },
                new TimelineEvent
                {
                    Order = 2,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Xxcha_Kingdom\",\"points\":1,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 3,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Nekro_Virus\",\"points\":4,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 4,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"Sardakk_Norr\",\"points\":2,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 5,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Winnu\",\"points\":9,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 6,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"Sardakk_Norr\",\"points\":3,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 7,
                    EventType = "ObjectiveScored",
                    SerializedPayload = "{\"slug\":\"raise-a-fleet\",\"faction\":\"The_Winnu\",\"points\":10}",
                },
                new TimelineEvent
                {
                    Order = 8,
                    EventType = "SessionSummary",
                    SerializedPayload = "{\"winner\":\"The_Winnu\",\"results\":[{\"faction\":\"The_Xxcha_Kingdom\",\"points\":1},{\"faction\":\"The_Nekro_Virus\",\"points\":4},{\"faction\":\"Sardakk_Norr\",\"points\":3},{\"faction\":\"The_Winnu\",\"points\":10}]}",
                },
            };
            var timeline = new Timeline(new Session { Events = given });

            // when
            var actual = timeline.AddSessionSummary().GetEvents();

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldIncludeSessionSummaryIfPlayerScoresPointsToExceedVictoryPointTarget()
        {
            // given
            var given = new List<GameEvent>()
            {
                new GameEvent
                {
                    EventType = nameof(CommitDraft),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new CommitDraftPayload
                    {
                        Factions = new string[] { "The_Nekro_Virus", "Sardakk_Norr", "The_Winnu", "The_Xxcha_Kingdom" },
                    }, this.SerializerSettings),
                },
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
                            Faction = "The_Nekro_Virus",
                            Points = 4,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "Sardakk_Norr",
                            Points = 2,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Winnu",
                            Points = 9,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "Sardakk_Norr",
                            Points = 3,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(ObjectiveScored),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new ObjectiveScoredPayload
                    {
                            Faction = "The_Winnu",
                            Slug = "centralize-galactic-trade",
                            Points = 11,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Winnu",
                            Points = 11,
                    }, this.SerializerSettings),
                },
            };
            var expected = new List<TimelineEvent>()
            {
                new TimelineEvent
                {
                    Order = 0,
                    EventType = "CommitDraft",
                    SerializedPayload = "{\"factions\":[\"The_Nekro_Virus\",\"Sardakk_Norr\",\"The_Winnu\",\"The_Xxcha_Kingdom\"],\"tablePositions\":[],\"initiative\":[]}",
                },
                new TimelineEvent
                {
                    Order = 1,
                    EventType = "ObjectiveAdded",
                    SerializedPayload = "{\"slug\":\"raise-a-fleet\"}",
                },
                new TimelineEvent
                {
                    Order = 2,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Xxcha_Kingdom\",\"points\":1,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 3,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Nekro_Virus\",\"points\":4,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 4,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"Sardakk_Norr\",\"points\":2,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 5,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Winnu\",\"points\":9,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 6,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"Sardakk_Norr\",\"points\":3,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 7,
                    EventType = "ObjectiveScored",
                    SerializedPayload = "{\"slug\":\"centralize-galactic-trade\",\"faction\":\"The_Winnu\",\"points\":11}",
                },
                new TimelineEvent
                {
                    Order = 8,
                    EventType = "SessionSummary",
                    SerializedPayload = "{\"winner\":\"The_Winnu\",\"results\":[{\"faction\":\"The_Xxcha_Kingdom\",\"points\":1},{\"faction\":\"The_Nekro_Virus\",\"points\":4},{\"faction\":\"Sardakk_Norr\",\"points\":3},{\"faction\":\"The_Winnu\",\"points\":11}]}",
                },
            };
            var timeline = new Timeline(new Session { Events = given });

            // when
            var actual = timeline.AddSessionSummary().GetEvents();

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldIncludeSessionSummaryForUpdatedVpCount()
        {
            // given
            var given = new List<GameEvent>()
            {
                new GameEvent
                {
                    EventType = nameof(CommitDraft),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new CommitDraftPayload
                    {
                        Factions = new string[] { "The_Nekro_Virus", "Sardakk_Norr", "The_Winnu", "The_Xxcha_Kingdom" },
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(MetadataUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(new MetadataUpdatedPayload
                    {
                            SessionDisplayName = "tarnas test session",
                            VpCount = 12,
                    }),
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
                            Faction = "The_Nekro_Virus",
                            Points = 4,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "Sardakk_Norr",
                            Points = 2,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Winnu",
                            Points = 12,
                    }, this.SerializerSettings),
                },
            };
            var expected = new List<TimelineEvent>()
            {
                new TimelineEvent
                {
                    Order = 0,
                    EventType = "CommitDraft",
                    SerializedPayload = "{\"factions\":[\"The_Nekro_Virus\",\"Sardakk_Norr\",\"The_Winnu\",\"The_Xxcha_Kingdom\"],\"tablePositions\":[],\"initiative\":[]}",
                },
                new TimelineEvent
                {
                    Order = 1,
                    EventType = "VpCountChanged",
                    SerializedPayload = "{\"from\":10,\"to\":12}",
                },
                new TimelineEvent
                {
                    Order = 2,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Xxcha_Kingdom\",\"points\":1,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 3,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Nekro_Virus\",\"points\":4,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 4,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"Sardakk_Norr\",\"points\":2,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 5,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Winnu\",\"points\":12,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 6,
                    EventType = "SessionSummary",
                    SerializedPayload = "{\"winner\":\"The_Winnu\",\"results\":[{\"faction\":\"The_Xxcha_Kingdom\",\"points\":1},{\"faction\":\"The_Nekro_Virus\",\"points\":4},{\"faction\":\"Sardakk_Norr\",\"points\":2},{\"faction\":\"The_Winnu\",\"points\":12}]}",
                },
            };
            var timeline = new Timeline(new Session { Events = given });

            // when
            var actual = timeline.AddSessionSummary().GetEvents();

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldNotIncludeSessionSummaryIfUpdatedVpCountIsNotReached()
        {
            // given
            var given = new List<GameEvent>()
            {
                new GameEvent
                {
                    EventType = nameof(CommitDraft),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new CommitDraftPayload
                    {
                        Factions = new string[] { "The_Nekro_Virus", "Sardakk_Norr", "The_Winnu", "The_Xxcha_Kingdom" },
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(MetadataUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(new MetadataUpdatedPayload
                    {
                            SessionDisplayName = "tarnas test session",
                            VpCount = 12,
                    }),
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
                            Faction = "The_Nekro_Virus",
                            Points = 4,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "Sardakk_Norr",
                            Points = 2,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Winnu",
                            Points = 10,
                    }, this.SerializerSettings),
                },
            };
            var expected = new List<TimelineEvent>()
            {
                new TimelineEvent
                {
                    Order = 0,
                    EventType = "CommitDraft",
                    SerializedPayload = "{\"factions\":[\"The_Nekro_Virus\",\"Sardakk_Norr\",\"The_Winnu\",\"The_Xxcha_Kingdom\"],\"tablePositions\":[],\"initiative\":[]}",
                },
                new TimelineEvent
                {
                    Order = 1,
                    EventType = "VpCountChanged",
                    SerializedPayload = "{\"from\":10,\"to\":12}",
                },
                new TimelineEvent
                {
                    Order = 2,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Xxcha_Kingdom\",\"points\":1,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 3,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Nekro_Virus\",\"points\":4,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 4,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"Sardakk_Norr\",\"points\":2,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 5,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Winnu\",\"points\":10,\"source\":0,\"context\":null}",
                },
            };
            var timeline = new Timeline(new Session { Events = given });

            // when
            var actual = timeline.AddSessionSummary().GetEvents();

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldIncludeLastVPValueForEachFaction()
        {
            // given
            var given = new List<GameEvent>()
            {
                new GameEvent
                {
                    EventType = nameof(CommitDraft),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new CommitDraftPayload
                    {
                        Factions = new string[] { "The_Nekro_Virus", "Sardakk_Norr", "The_Winnu", "The_Xxcha_Kingdom" },
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
                            Faction = "The_Nekro_Virus",
                            Points = 4,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "Sardakk_Norr",
                            Points = 2,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Winnu",
                            Points = 10,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Nekro_Virus",
                            Points = 3,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Xxcha_Kingdom",
                            Points = 2,
                    }, this.SerializerSettings),
                },
            };
            var expected = new List<TimelineEvent>()
            {
                new TimelineEvent
                {
                    Order = 0,
                    EventType = "CommitDraft",
                    SerializedPayload = "{\"factions\":[\"The_Nekro_Virus\",\"Sardakk_Norr\",\"The_Winnu\",\"The_Xxcha_Kingdom\"],\"tablePositions\":[],\"initiative\":[]}",
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
                    SerializedPayload = "{\"faction\":\"The_Nekro_Virus\",\"points\":4,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 3,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"Sardakk_Norr\",\"points\":2,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 4,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Winnu\",\"points\":10,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 5,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Nekro_Virus\",\"points\":3,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 6,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Xxcha_Kingdom\",\"points\":2,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 7,
                    EventType = "SessionSummary",
                    SerializedPayload = "{\"winner\":\"The_Winnu\",\"results\":[{\"faction\":\"The_Xxcha_Kingdom\",\"points\":2},{\"faction\":\"The_Nekro_Virus\",\"points\":3},{\"faction\":\"Sardakk_Norr\",\"points\":2},{\"faction\":\"The_Winnu\",\"points\":10}]}",
                },
            };
            var timeline = new Timeline(new Session { Events = given });

            // when
            var actual = timeline.AddSessionSummary().GetEvents();

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldMarkTheFirstPlayerToScoreMaxVPAsWinner()
        {
            // given
            var given = new List<GameEvent>()
            {
                new GameEvent
                {
                    EventType = nameof(CommitDraft),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new CommitDraftPayload
                    {
                        Factions = new string[] { "The_Nekro_Virus", "Sardakk_Norr", "The_Winnu", "The_Xxcha_Kingdom" },
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
                            Faction = "The_Nekro_Virus",
                            Points = 4,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "Sardakk_Norr",
                            Points = 2,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Winnu",
                            Points = 10,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Nekro_Virus",
                            Points = 3,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Xxcha_Kingdom",
                            Points = 10,
                    }, this.SerializerSettings),
                },
            };
            var expected = new List<TimelineEvent>()
            {
                new TimelineEvent
                {
                    Order = 0,
                    EventType = "CommitDraft",
                    SerializedPayload = "{\"factions\":[\"The_Nekro_Virus\",\"Sardakk_Norr\",\"The_Winnu\",\"The_Xxcha_Kingdom\"],\"tablePositions\":[],\"initiative\":[]}",
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
                    SerializedPayload = "{\"faction\":\"The_Nekro_Virus\",\"points\":4,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 3,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"Sardakk_Norr\",\"points\":2,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 4,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Winnu\",\"points\":10,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 5,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Nekro_Virus\",\"points\":3,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 6,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Xxcha_Kingdom\",\"points\":10,\"source\":0,\"context\":null}",
                },
                new TimelineEvent
                {
                    Order = 7,
                    EventType = "SessionSummary",
                    SerializedPayload = "{\"winner\":\"The_Winnu\",\"results\":[{\"faction\":\"The_Xxcha_Kingdom\",\"points\":10},{\"faction\":\"The_Nekro_Virus\",\"points\":3},{\"faction\":\"Sardakk_Norr\",\"points\":2},{\"faction\":\"The_Winnu\",\"points\":10}]}",
                },
            };
            var timeline = new Timeline(new Session { Events = given });

            // when
            var actual = timeline.AddSessionSummary().GetEvents();

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldNotIncludeSessionSummaryIfNoOneWonYet()
        {
            // given
            var given = new List<GameEvent>()
            {
                new GameEvent
                {
                    EventType = nameof(CommitDraft),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new CommitDraftPayload
                    {
                        Factions = new string[] { "The_Nekro_Virus", "Sardakk_Norr", "The_Winnu", "The_Xxcha_Kingdom" },
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
                    EventType = "CommitDraft",
                    SerializedPayload = "{\"factions\":[\"The_Nekro_Virus\",\"Sardakk_Norr\",\"The_Winnu\",\"The_Xxcha_Kingdom\"],\"tablePositions\":[],\"initiative\":[]}",
                },
                new TimelineEvent
                {
                    Order = 1,
                    EventType = "VictoryPointsUpdated",
                    SerializedPayload = "{\"faction\":\"The_Xxcha_Kingdom\",\"points\":1,\"source\":0,\"context\":null}",
                },
            };
            var timeline = new Timeline(new Session { Events = given });

            // when
            var actual = timeline.AddSessionSummary().GetEvents();

            // then
            actual.Should().BeEquivalentTo(expected);
        }
    }
}
