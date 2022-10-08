using Newtonsoft.Json;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Domain
{
    public class AddPointSource : IHandler
    {
        private readonly IRepository repository;

        public AddPointSource(IRepository repository)
        {
            this.repository = repository;
        }

        public async Task Handle(GameEvent gameEvent)
        {
            var session = await this.repository.GetByIdWithEvents(gameEvent.SessionId);

            if (session.Events == null)
            {
                return;
            }

            var sourcePayload = VictoryPointsUpdated.GetPayload(gameEvent);
            var lastMatchingPoint = session.Events.Where(e => e.EventType == nameof(VictoryPointsUpdated)).OrderByDescending(e => e.HappenedAt).FirstOrDefault(e =>
            {
                var pointUpdatePayload = VictoryPointsUpdated.GetPayload(e);

                return pointUpdatePayload.Faction == sourcePayload.Faction && pointUpdatePayload.Points == sourcePayload.Points;
            });

            if (lastMatchingPoint == null)
            {
                return;
            }

            var payloadToUpdate = VictoryPointsUpdated.GetPayload(lastMatchingPoint);
            payloadToUpdate.Source = sourcePayload.Source;
            payloadToUpdate.Context = sourcePayload.Context;
            lastMatchingPoint.SerializedPayload = JsonConvert.SerializeObject(payloadToUpdate);

            this.repository.UpdateSession(session);

            await this.repository.SaveChangesAsync();
        }
    }
}
