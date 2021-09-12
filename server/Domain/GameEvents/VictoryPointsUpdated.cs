using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace server.Domain
{
    public class VictoryPointsUpdated: IHandler
    {
        private readonly IRepository _repository;

        public VictoryPointsUpdated(IRepository repository)
        {
            _repository = repository;
        }

        public async Task Handle(GameEvent gameEvent)
        {
            var session = await _repository.GetByIdWithEvents(gameEvent.SessionId);

            if (session.Events == null)
            {
                session.Events = new List<GameEvent>();
            }
            session.Events.Add(gameEvent);

            _repository.UpdateSession(session);

            await _repository.SaveChangesAsync();
        }

        public static VictoryPointsUpdatedPayload GetPayload(GameEvent gameEvent)
        {
            return JsonConvert.DeserializeObject<VictoryPointsUpdatedPayload>(gameEvent.SerializedPayload);
        }
    }

    public class VictoryPointsUpdatedPayload
    {
        public string Faction { get; set; }
        public int Points { get; set; }
    }
}
