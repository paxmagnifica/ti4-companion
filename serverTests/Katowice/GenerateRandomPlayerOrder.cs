using FluentAssertions;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using NUnit.Framework;
using Server.Domain;
using System;
using KTW = Server.Domain.Katowice;

namespace ServerTests.Katowice
{
    public class GenerateRandomPlayerOrder
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
        public void ShouldAddRandomizedOrderToGameStartedPayload()
        {
            // given
            var given = new GameStartedPayload
            {
                SetupType = "katowice_draft",
                Options = new DraftOptions
                {
                    Players = new string[] { "Player1", "Player2", "Player3", "Player4", "Player5", "Player6" },
                },
            };

            // when
            GameStartedPayload payload = KTW.Draft.GetPayloadWithRandomOrder(given);

            // then
            payload.RandomPlayerOrder.Length.Should().Be(6);
            payload.Should().NotBeSameAs(given);
        }

        [Test]
        public void ShouldNotWorkOnPayloadsNotFromKatowiceDraft()
        {
            // given
            var given = new GameStartedPayload
            {
                SetupType = "draft",
            };

            // when
            Func<GameStartedPayload> act = () => KTW.Draft.GetPayloadWithRandomOrder(given);

            // then
            act.Should().Throw<KTW.InvalidGameException>();
        }
    }
}
