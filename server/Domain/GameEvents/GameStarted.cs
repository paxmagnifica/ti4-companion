using Newtonsoft.Json;
using System.Threading.Tasks;

namespace Server.Domain
{
    public class GameStarted : IHandler
    {
        public Task Handle(GameEvent gameEvent)
        {
            throw new System.NotImplementedException();
        }

        internal static GameStartedPayload GetPayload(GameEvent gameEvent)
        {
            return JsonConvert.DeserializeObject<GameStartedPayload>(gameEvent.SerializedPayload);
        }
    }
}
