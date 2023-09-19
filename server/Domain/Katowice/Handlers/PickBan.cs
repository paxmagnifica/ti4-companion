using Newtonsoft.Json;
using System.Threading.Tasks;

namespace Server.Domain.Katowice
{
    public class PickBan : IHandler
    {
        private readonly IRepository repository;

        public PickBan(IRepository repository)
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
            // check if not duplicated

            session.Events.Add(gameEvent);

            this.repository.UpdateSession(session);

            await this.repository.SaveChangesAsync();
        }

        internal static PickBanPayload GetPayload(GameEvent gameEvent)
        {
            return GetPayload(gameEvent.SerializedPayload);
        }

        internal static PickBanPayload GetPayload(string serializedPayload)
        {
            return JsonConvert.DeserializeObject<PickBanPayload>(serializedPayload);
        }
    }
}