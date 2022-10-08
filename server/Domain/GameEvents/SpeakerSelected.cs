//

using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.Domain
{
    public class SpeakerSelected : IHandler
    {
        private readonly IRepository repository;

        public SpeakerSelected(IRepository repository)
        {
            this.repository = repository;
        }

        public async Task Handle(GameEvent gameEvent)
        {
            var session = await this.repository.GetByIdWithEvents(gameEvent.SessionId);

            if (session.Events == null)
            {
                session.Events = new List<GameEvent>();
            }

            session.Events.Add(gameEvent);

            this.repository.UpdateSession(session);

            await this.repository.SaveChangesAsync();
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
