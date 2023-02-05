using FluentAssertions;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using NUnit.Framework;
using Server.Controllers;
using Server.Domain;
using System.Collections.Generic;

namespace ServerTests
{
    public class MapPositions
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
        public void ShouldReturnMapPositionsFromGameStartIfNotUpdated()
        {
            // given
            var expected = new MapPosition[] { new MapPosition { Name = "p1", Color = "c1" }, new MapPosition { Name = "p2", Color = "c2" } };
            var sessionEvents = new List<GameEvent>()
            {
                new GameEvent
                {
                    EventType = nameof(GameStarted),
                    SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload
                    {
                        Options = new DraftOptions
                        {
                            InitialPool = new string[] { "The_VuilRaith_Cabal", "The_Nomad" },
                            Players = new string[] { "Player 1", "Player 2" },
                            TablePick = true,
                            MapPositions = expected,
                        },
                    }),
                },
            };
            var timeline = new Timeline(new Session
            {
                Events = sessionEvents,
            });

            // when
            var sessionDto = new SessionDto(new Session { Events = sessionEvents });

            // then
            sessionDto.MapPositions.Should().BeEquivalentTo(expected);
        }

        [Test]
        public void ShouldReturnMapPositionsFromMetadataUpdatedEventIfPresent()
        {
            // given
            var expected = new MapPosition[] { new MapPosition { Name = "pppp1", Color = "c1" }, new MapPosition { Name = "pppp2", Color = "c2" } };
            var sessionEvents = new List<GameEvent>()
            {
                new GameEvent
                {
                    EventType = nameof(GameStarted),
                    SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload
                    {
                        Options = new DraftOptions
                        {
                            InitialPool = new string[] { "The_VuilRaith_Cabal", "The_Nomad" },
                            Players = new string[] { "Player 1", "Player 2" },
                            TablePick = true,
                            MapPositions = new MapPosition[] { new MapPosition { Name = "p1" }, new MapPosition { Name = "p2" } },
                        },
                    }),
                },
                new GameEvent
                {
                    EventType = nameof(MetadataUpdated),
                    SerializedPayload = JsonConvert.SerializeObject(new MetadataUpdatedPayload
                    {
                        MapPositions = new List<MapPosition>(expected),
                    }),
                },
            };
            var timeline = new Timeline(new Session
            {
                Events = sessionEvents,
            });

            // when
            var sessionDto = new SessionDto(new Session { Events = sessionEvents });

            // then
            sessionDto.MapPositions.Should().BeEquivalentTo(expected);
        }
    }
}
