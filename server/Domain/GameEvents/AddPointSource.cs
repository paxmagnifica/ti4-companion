using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace server.Domain
{
    public class AddPointSource : IHandler
    {
        private readonly IRepository _repository;

        public AddPointSource(IRepository repository)
        {
            _repository = repository;
        }

        public async Task Handle(GameEvent gameEvent)
        {
            var session = await _repository.GetByIdWithEvents(gameEvent.SessionId);

            if (session.Events == null)
            {
                return;
            }

            var sourcePayload = VictoryPointsUpdated.GetPayload(gameEvent);
            var lastMatchingPoint = session.Events.Where(e => e.EventType == nameof(VictoryPointsUpdated)).OrderByDescending(e => e.HappenedAt).FirstOrDefault(e => {
                var pointUpdatePayload = VictoryPointsUpdated.GetPayload(e);

                return pointUpdatePayload.Faction == sourcePayload.Faction && pointUpdatePayload.Points == sourcePayload.Points;
            });

            if (lastMatchingPoint == null) {
                return;
            }

            var payloadToUpdate = VictoryPointsUpdated.GetPayload(lastMatchingPoint);
            payloadToUpdate.Source = sourcePayload.Source;
            payloadToUpdate.Context = sourcePayload.Context;
            lastMatchingPoint.SerializedPayload = JsonConvert.SerializeObject(payloadToUpdate);

            _repository.UpdateSession(session);

            await _repository.SaveChangesAsync();
        }
    }
}
