using System.Collections.Generic;
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
    }

    public class DraftOptions
    {
        public DraftOptions()
        {
            InitialPool = new string[0];
            Players = new string[0];
        }

        public string[] InitialPool { get; set; }
        public string[] Players { get; set; }
        public int PlayerCount { get { return Players.Length; } }
        public bool Bans { get; set; }
        public int BanRounds { get; set; }
        public int BansPerRound { get; set; }
        public bool TablePick { get; set; }
        public int AllBansCount { get => PlayerCount * BansPerRound * BanRounds; }
    }
}
