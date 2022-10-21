using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.Domain
{
    public enum VoteResult
    {
        For,
        Against,
        Elected,
    }

    public class AgendaVotedOn : IHandler
    {
        private readonly IRepository repository;

        public AgendaVotedOn(IRepository repository)
        {
            this.repository = repository;
        }

        public static AgendaVotedOnPayload GetPayload(GameEvent gameEvent)
        {
            return GetPayload(gameEvent.SerializedPayload);
        }

        public static AgendaVotedOnPayload GetPayload(string serializedPayload)
        {
            return JsonConvert.DeserializeObject<AgendaVotedOnPayload>(serializedPayload);
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
    }
}
