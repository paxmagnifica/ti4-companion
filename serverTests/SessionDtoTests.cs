using FluentAssertions;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using NUnit.Framework;
using Server.Controllers;
using Server.Domain;
using System;
using System.Collections.Generic;

namespace ServerTests
{
    public class SessionDtoTests
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
        public void ShouldMarkSessionAsFinishedIfAnyPlayerExceedsVictoryPoints()
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
                    EventType = nameof(GameStarted),
                    SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload
                    {
                        Options = new DraftOptions
                        {
                            InitialPool = new string[] { "The_Nekro_Virus", "Sardakk_Norr", "The_Winnu", "The_Xxcha_Kingdom" },
                            Players = new string[] { "Player 1", "Player 2" },
                        },
                    }),
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

            // when
            var sessionDto = new SessionDto(new Session { Events = given });

            // then
            sessionDto.Finished.Should().BeTrue();
        }

        [Test]
        public void ShouldMarkSessionAsFinishedIfAnyPlayerExceedsCustomVictoryPoints()
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
                    EventType = nameof(GameStarted),
                    SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload
                    {
                        Options = new DraftOptions
                        {
                            InitialPool = new string[] { "The_Nekro_Virus", "Sardakk_Norr", "The_Winnu", "The_Xxcha_Kingdom" },
                            Players = new string[] { "Player 1", "Player 2" },
                        },
                    }),
                },
                new GameEvent
                {
                    EventType = nameof(MetadataUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(new MetadataUpdatedPayload
                    {
                        VpCount = 12,
                    }),
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
                new GameEvent
                {
                    EventType = nameof(ObjectiveScored),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new ObjectiveScoredPayload
                    {
                            Faction = "The_Winnu",
                            Slug = "conquer-the-weak",
                            Points = 13,
                    }, this.SerializerSettings),
                },
                new GameEvent
                {
                    EventType = nameof(VictoryPointsUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(
                        new VictoryPointsUpdatedPayload
                    {
                            Faction = "The_Winnu",
                            Points = 13,
                    }, this.SerializerSettings),
                },
            };

            // when
            var sessionDto = new SessionDto(new Session { Events = given });

            // then
            sessionDto.Finished.Should().BeTrue();
        }
    }
}
