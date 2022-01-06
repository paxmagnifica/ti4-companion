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

    public class LawPassed : IHandler
    {
        private readonly IRepository _repository;

        public LawPassed(IRepository repository)
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

        public static LawPassedPayload GetPayload(GameEvent gameEvent)
        {
            return GetPayload(gameEvent.SerializedPayload);
        }

        public static LawPassedPayload GetPayload(string serializedPayload)
        {
            return JsonConvert.DeserializeObject<LawPassedPayload>(serializedPayload);
        }
    }

    public class LawPassedPayload
    {
        public string Slug { get; set; }
        public VoteResult Result { get; set; }
        public string Election { get; set; }
    }
}
