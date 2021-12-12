using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace server.Domain
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

    public class GameStartedPayload
    {
        public GameStartedPayload()
        {
            Factions = new List<string>();
        }

        public string SetupType { get; set; }
        public List<string> Factions { get; set; }
        public DraftOptions Options { get; set; }

        public bool IsDraft
        {
            get
            {
                return !Factions.Any();
            }
        }
    }

    public class DraftOptions
    {
        public int PlayerCount { get; set; }
        public bool Bans { get; set; }
        public int BanRounds { get; set; }
        public int BansPerRound { get; set; }
        public bool TablePick { get; set; }
    }
}
