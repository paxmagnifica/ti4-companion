using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace server.Domain
{
    public class SpeakerSelected : IHandler
    {
        private readonly IRepository _repository;

        public SpeakerSelected(IRepository repository)
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

        internal static SpeakerSelectedPayload GetPayload(GameEvent gameEvent)
        {
            return GetPayload(gameEvent.SerializedPayload);
        }

        internal static SpeakerSelectedPayload GetPayload(string serializedPayload)
        {
            return JsonConvert.DeserializeObject<SpeakerSelectedPayload>(serializedPayload);
        }
    }

    public class SpeakerSelectedPayload
    {
        public int SpeakerIndex { get; set; }
        public string SpeakerName { get; set; }
    }
}
