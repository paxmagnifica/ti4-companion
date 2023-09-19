using Newtonsoft.Json;
using System.Threading.Tasks;

namespace Server.Domain
{
    public class GameStarted : IHandler
    {
        public Task Handle(GameEvent gameEvent)
        {
            // this is handled in SessionsController.Post
            throw new System.NotImplementedException();
        }

        internal static GameStartedPayload GetPayload(GameEvent gameEvent)
        {
            return JsonConvert.DeserializeObject<GameStartedPayload>(gameEvent.SerializedPayload);
        }

        internal static GameStartedPayload GetPayload(string serializedPayload)
        {
            return JsonConvert.DeserializeObject<GameStartedPayload>(serializedPayload);
        }
    }
}
