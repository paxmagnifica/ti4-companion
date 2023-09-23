using FluentAssertions;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using NSubstitute;
using NUnit.Framework;
using Server.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ServerTests.Katowice
{
    public class DraftPick
    {
        public DraftPick()
        {
            this.Repository = Substitute.For<IRepository>();
        }

        private JsonSerializerSettings SerializerSettings
        {
            get
            {
                var serializerSettings = new JsonSerializerSettings();
                serializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                return serializerSettings;
            }
        }

        private IRepository Repository { get; set; }

        [Test]
        public async Task ShouldAddCommitDraftEventAfterAllDraftPicks()
        {
            // given
            var sessionWithOneDraftToGo = Data.GetFullyDraftedSession();
            sessionWithOneDraftToGo.Events.RemoveAt(sessionWithOneDraftToGo.Events.Count - 1);

            this.Repository.GetByIdWithEvents(Arg.Any<Guid>()).Returns(sessionWithOneDraftToGo);

            var draftPickHandler = new Server.Domain.Katowice.DraftPick(this.Repository);
            var given = new GameEvent
            {
                EventType = nameof(Server.Domain.Katowice.DraftPick),
                SerializedPayload = JsonConvert.SerializeObject(new Server.Domain.Katowice.DraftPickPayload
                {
                    Action = "faction",
                    Choice = "The_Argent_Flight",
                    PlayerIndex = 4,
                }),
            };
            var expectedFactions = new string[] { "The_Barony_of_Letnev", "The_Arborec", "The_Embers_of_Muaat", "The_Yin_Brotherhood", "The_Argent_Flight", "The_L1Z1X_Mindnet" };
            var expectedTablePositions = new int[] { 2, 5, 1, 0, 3, 4 };
            var expectedInitiative = new int[] { 6, 4, 1, 5, 3, 2 };

            // when
            await draftPickHandler.Handle(given);

            // then
            var commitDraftEvent = sessionWithOneDraftToGo.Events.Last();
            commitDraftEvent.EventType.Should().Be(nameof(CommitDraft));
            var payload = CommitDraft.GetPayload(commitDraftEvent);
            payload.Factions.Should().BeEquivalentTo(expectedFactions);
            payload.TablePositions.Should().BeEquivalentTo(expectedTablePositions);
            payload.Initiative.Should().BeEquivalentTo(expectedInitiative);
        }
    }
}
