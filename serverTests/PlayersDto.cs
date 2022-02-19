using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;
using FluentAssertions;
using server.Controllers;
using server.Domain;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace serverTests
{
    public class PlayersDto
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
        public void ShouldIncludeAllFactions()
        {
            // given
            var session = new SessionDto()
            {
                Factions = new List<string>() { "F1", "F2", "F3", "F4" }
            };
            var expected = new[] { new PlayerDto { Faction = "F1" }, new PlayerDto { Faction = "F2" }, new PlayerDto { Faction = "F3" }, new PlayerDto { Faction = "F4" } };

            // when
            var actual = PlayerDto.GetPlayers(session);

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldIncludePlayerNamesFromDraftDtoIfPresent()
        {
            // given
            var session = new SessionDto()
            {
                Factions = new List<string>() { "F1", "F2", "F3", "F4" },
                Draft = new DraftDto()
                {
                    Picks = new PickedPayload[] {
                        new PickedPayload { Pick = "F1", PlayerName = "P1", Type = "faction" },
                        new PickedPayload { Pick = "F2", PlayerName = "P2", Type = "faction" },
                        new PickedPayload { Pick = "F3", PlayerName = "P3", Type = "faction" },
                        new PickedPayload { Pick = "F4", PlayerName = "P4", Type = "faction" }
                    }
                }
            };
            var expected = new[]
            {
                new PlayerDto { Faction = "F1", PlayerName = "P1" },
                new PlayerDto { Faction = "F2", PlayerName = "P2" },
                new PlayerDto { Faction = "F3", PlayerName = "P3" },
                new PlayerDto { Faction = "F4", PlayerName = "P4" }
            };

            // when
            var actual = PlayerDto.GetPlayers(session);

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldIncludeAvailableColorsIfPresent()
        {
            // given
            var session = new SessionDto()
            {
                Factions = new List<string>() { "F1", "F2", "F3", "F4" },
                Colors = new Dictionary<string, string>() { { "F1", "yellow" }, { "F4", "black" } }
            };
            var expected = new[]
            {
                new PlayerDto { Faction = "F1", Color = "yellow" },
                new PlayerDto { Faction = "F2" },
                new PlayerDto { Faction = "F3" },
                new PlayerDto { Faction = "F4", Color = "black" }
            };

            // when
            var actual = PlayerDto.GetPlayers(session);

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldIndicateTheSpeakerIfDraftAvailable()
        {
            // given
            var session = new SessionDto()
            {
                Factions = new List<string>() { "F1", "F2", "F3", "F4" },
                Draft = new DraftDto()
                {
                    Picks = new PickedPayload[] {
                        new PickedPayload { Pick = "F1", PlayerName = "P1", Type = "faction" },
                        new PickedPayload { Pick = "F2", PlayerName = "P2", Type = "faction" },
                        new PickedPayload { Pick = "F3", PlayerName = "P3", Type = "faction" },
                        new PickedPayload { Pick = "F4", PlayerName = "P4", Type = "faction" }
                    },
                    Speaker = "P3",
                }
            };
            var expected = new[]
            {
                new PlayerDto { Faction = "F1", PlayerName = "P1" },
                new PlayerDto { Faction = "F2", PlayerName = "P2" },
                new PlayerDto { Faction = "F3", PlayerName = "P3", Speaker = true },
                new PlayerDto { Faction = "F4", PlayerName = "P4" }
            };

            // when
            var actual = PlayerDto.GetPlayers(session);

            // then
            actual.Should().BeEquivalentTo(expected);
        }
    }
}
