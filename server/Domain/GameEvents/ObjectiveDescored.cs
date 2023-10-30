using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.Domain
{
    public class ObjectiveDescored : IHandler
    {
        private readonly IRepository repository;
        private readonly ITimeProvider timeProvider;

        public ObjectiveDescored(IRepository repository, ITimeProvider timeProvider)
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

            var payload = ObjectiveDescored.GetPayload(gameEvent);

            session.Events.Add(new GameEvent
            {
                EventType = nameof(VictoryPointsUpdated),
                HappenedAt = timeProvider.Now,
                SerializedPayload = JsonConvert.SerializeObject(new VictoryPointsUpdatedPayload
                {
                    Faction = payload.Faction,
                    Points = payload.Points,
                })
            });

            session.Events.Add(gameEvent);

            this.repository.UpdateSession(session);

            await this.repository.SaveChangesAsync();
        }

        internal static ObjectiveDescoredPayload GetPayload(GameEvent gameEvent)
        {
            return JsonConvert.DeserializeObject<ObjectiveDescoredPayload>(gameEvent.SerializedPayload);
        }

        internal static ObjectiveDescoredPayload GetPayload(string serializedPayload)
        {
            return JsonConvert.DeserializeObject<ObjectiveDescoredPayload>(serializedPayload);
        }
    }
}
