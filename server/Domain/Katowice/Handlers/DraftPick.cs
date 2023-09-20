using Newtonsoft.Json;
using System.Threading.Tasks;

namespace Server.Domain.Katowice
{
    public class DraftPick : IHandler
    {
        private readonly IRepository repository;

        public DraftPick(IRepository repository)
        {
            this.repository = repository;
        }

        public async Task Handle(GameEvent gameEvent)
        {
            var session = await this.repository.GetByIdWithEvents(gameEvent.SessionId);

            if (session.Events == null)
            {
                // error
            }

            // TODO checks:
            // check if action is the same as current player
            // check if playerindex is the same as current player
            // check if confirming without nomination
            // check if not duplicated (nominating nominated/confirmed or confirming confirmed)

            session.Events.Add(gameEvent);

            this.repository.UpdateSession(session);

            await this.repository.SaveChangesAsync();
        }

        internal static DraftPickPayload GetPayload(GameEvent gameEvent)
        {
            return GetPayload(gameEvent.SerializedPayload);
        }

        internal static DraftPickPayload GetPayload(string serializedPayload)
        {
            return JsonConvert.DeserializeObject<DraftPickPayload>(serializedPayload);
        }
    }
}
