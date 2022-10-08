using FluentAssertions;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using NUnit.Framework;
using Server.Controllers;
using Server.Domain;
using System.Collections.Generic;
using System.Linq;

namespace ServerTests
{
    public class PlayersDto
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
        public void ShouldIncludeAllFactions()
        {
            // given
            var session = new SessionDto()
            {
                Factions = new List<string>() { "F1", "F2", "F3", "F4" },
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
                    Picks = new PickedPayload[]
                    {
                        new PickedPayload { Pick = "F1", PlayerName = "P1", Type = "faction" },
                        new PickedPayload { Pick = "F2", PlayerName = "P2", Type = "faction" },
                        new PickedPayload { Pick = "F3", PlayerName = "P3", Type = "faction" },
                        new PickedPayload { Pick = "F4", PlayerName = "P4", Type = "faction" },
                    },
                },
            };
            var expected = new[]
            {
                new PlayerDto { Faction = "F1", PlayerName = "P1" },
                new PlayerDto { Faction = "F2", PlayerName = "P2" },
                new PlayerDto { Faction = "F3", PlayerName = "P3" },
                new PlayerDto { Faction = "F4", PlayerName = "P4" },
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
                Colors = new Dictionary<string, string>() { { "F1", "yellow" }, { "F4", "black" } },
            };
            var expected = new[]
            {
                new PlayerDto { Faction = "F1", Color = "yellow" },
                new PlayerDto { Faction = "F2" },
                new PlayerDto { Faction = "F3" },
                new PlayerDto { Faction = "F4", Color = "black" },
            };

            // when
            var actual = PlayerDto.GetPlayers(session);

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldIncludeColorsEvenOnFactionKeyBeingLowercased()
        {
            // given
            var session = new SessionDto()
            {
                Factions = new List<string>() { "The_Mentak_Coalition", "F2", "F3", "The_Arborec" },
                Colors = new Dictionary<string, string>() { { "the_Mentak_Coalition", "yellow" }, { "the_Arborec", "black" } },
            };
            var expected = new[]
            {
                new PlayerDto { Faction = "The_Mentak_Coalition", Color = "yellow" },
                new PlayerDto { Faction = "F2" },
                new PlayerDto { Faction = "F3" },
                new PlayerDto { Faction = "The_Arborec", Color = "black" },
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
                    Picks = new PickedPayload[]
                    {
                        new PickedPayload { Pick = "F1", PlayerName = "P1", Type = "faction" },
                        new PickedPayload { Pick = "F2", PlayerName = "P2", Type = "faction" },
                        new PickedPayload { Pick = "F3", PlayerName = "P3", Type = "faction" },
                        new PickedPayload { Pick = "F4", PlayerName = "P4", Type = "faction" },
                    },
                    Speaker = "P3",
                },
            };
            var expected = new[]
            {
                new PlayerDto { Faction = "F1", PlayerName = "P1" },
                new PlayerDto { Faction = "F2", PlayerName = "P2" },
                new PlayerDto { Faction = "F3", PlayerName = "P3", Speaker = true },
                new PlayerDto { Faction = "F4", PlayerName = "P4" },
            };

            // when
            var actual = PlayerDto.GetPlayers(session);

            // then
            actual.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldPutPlayersInTableOrderStartingFromSpeakerIfPresentInDraft()
        {
            // given
            var session = new SessionDto()
            {
                Factions = new List<string>() { "F1", "F2", "F3", "F4" },
                Draft = new DraftDto()
                {
                    Picks = new PickedPayload[]
                    {
                        new PickedPayload { Pick = "F1", PlayerName = "P1", Type = "faction" },
                        new PickedPayload { Pick = "F2", PlayerName = "P2", Type = "faction" },
                        new PickedPayload { Pick = "F3", PlayerName = "P3", Type = "faction" },
                        new PickedPayload { Pick = "F4", PlayerName = "P4", Type = "faction" },
                        new PickedPayload { Pick = "1", PlayerName = "P2", Type = "tablePosition" },
                        new PickedPayload { Pick = "2", PlayerName = "P1", Type = "tablePosition" },
                        new PickedPayload { Pick = "3", PlayerName = "P4", Type = "tablePosition" },
                        new PickedPayload { Pick = "4", PlayerName = "P3", Type = "tablePosition" },
                    },
                    Speaker = "P3",
                },
            };
            var expected = new[]
            {
                new PlayerDto { Faction = "F3", PlayerName = "P3", Speaker = true, AtTable = 4 },
                new PlayerDto { Faction = "F2", PlayerName = "P2", AtTable = 1 },
                new PlayerDto { Faction = "F1", PlayerName = "P1", AtTable = 2 },
                new PlayerDto { Faction = "F4", PlayerName = "P4", AtTable = 3 },
            };

            // when
            var actual = PlayerDto.GetPlayers(session);

            // then
            actual.Should().BeEquivalentTo(expected);
            actual.Select(a => a.PlayerName).Should().ContainInOrder(expected.Select(e => e.PlayerName));
        }

        [Test]
        public void NobodyShouldBeSpeakerIfThereWasNoDraft()
        {
            // given
            var session = new SessionDto()
            {
                Factions = new List<string>() { "F1", "F2", "F3", "F4" },
            };
            var expected = new[]
            {
                new PlayerDto { Faction = "F1" },
                new PlayerDto { Faction = "F2" },
                new PlayerDto { Faction = "F3" },
                new PlayerDto { Faction = "F4" },
            };

            // when
            var actual = PlayerDto.GetPlayers(session);

            // then
            actual.Should().BeEquivalentTo(expected);
        }
    }
}
