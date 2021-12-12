using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace server.Domain
{
    public class Picked: IHandler
    {
        private readonly IRepository _repository;

        public Picked(IRepository repository)
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

        internal static PickedPayload GetPayload(GameEvent gameEvent)
        {
            return JsonConvert.DeserializeObject<PickedPayload>(gameEvent.SerializedPayload);
        }
    }

    public class PickedPayload {
      public string Pick { get; set; }
      public string Type {get; set; }
      public int PlayerIndex { get; set; }
      public string PlayerName { get; set; }
    }
}
