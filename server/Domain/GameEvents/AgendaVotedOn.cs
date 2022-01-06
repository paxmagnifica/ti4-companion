using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace server.Domain
{
    public enum VoteResult
    {
        For,
        Against,
        Elected
    }

    public class AgendaVotedOn : IHandler
    {
        private readonly IRepository _repository;

        public AgendaVotedOn(IRepository repository)
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

        public static AgendaVotedOnPayload GetPayload(GameEvent gameEvent)
        {
            return GetPayload(gameEvent.SerializedPayload);
        }

        public static AgendaVotedOnPayload GetPayload(string serializedPayload)
        {
            return JsonConvert.DeserializeObject<AgendaVotedOnPayload>(serializedPayload);
        }
    }

    public class AgendaVotedOnPayload
    {
        public string Slug { get; set; }
        public VoteResult Result { get; set; }
        public string Election { get; set; }
        public AgendaType Type { get; set; }
    }
}
