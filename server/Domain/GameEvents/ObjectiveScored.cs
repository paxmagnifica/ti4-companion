using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.Domain
{
    public class ObjectiveScored : IHandler
    {
        private readonly IRepository repository;
        private readonly ITimeProvider timeProvider;

        public ObjectiveScored(IRepository repository, ITimeProvider timeProvider)
        {
            this.repository = repository;
            this.timeProvider = timeProvider;
        }

        public async Task Handle(GameEvent gameEvent)
        {
            var session = await this.repository.GetByIdWithEvents(gameEvent.SessionId);

            if (session.Events == null)
            {
                session.Events = new List<GameEvent>();
            }

            var payload = ObjectiveScored.GetPayload(gameEvent);

            session.Events.Add(new GameEvent
            {
                EventType = nameof(VictoryPointsUpdated),
                HappenedAt = timeProvider.Now,
                SerializedPayload = JsonConvert.SerializeObject(new VictoryPointsUpdatedPayload
                {
                    Faction = payload.Faction,
                    Points = payload.Points,
                    Source = VictoryPointSource.Objective,
                    Context = payload.Slug,
                })
            });

            session.Events.Add(gameEvent);

            this.repository.UpdateSession(session);

            await this.repository.SaveChangesAsync();
        }

        internal static ObjectiveScoredPayload GetPayload(GameEvent gameEvent)
        {
            return JsonConvert.DeserializeObject<ObjectiveScoredPayload>(gameEvent.SerializedPayload);
        }

        internal static ObjectiveScoredPayload GetPayload(string serializedPayload)
        {
            return JsonConvert.DeserializeObject<ObjectiveScoredPayload>(serializedPayload);
        }
    }
}
