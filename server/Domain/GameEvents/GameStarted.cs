
using Newtonsoft.Json;
using System.Collections.Generic;
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

    public class GameStartedPayload
    {
        public GameStartedPayload()
        {
            this.Factions = new List<string>();
            this.GameVersion = GameVersion.PoK_Codex3;
        }

        public string SetupType { get; set; }

        public List<string> Factions { get; set; }

        public GameVersion GameVersion { get; set; }

        public DraftOptions Options { get; set; }

        public string Password { get; set; }
    }

    public class DraftOptions
    {
        public DraftOptions()
        {
            this.InitialPool = new string[0];
            this.Players = new string[0];
        }

        public string[] InitialPool { get; set; }

        public string[] Players { get; set; }

        public int PlayerCount
        {
            get { return this.Players.Length; }
        }

        public bool Bans { get; set; }

        public int BanRounds { get; set; }

        public int BansPerRound { get; set; }

        public bool TablePick { get; set; }

        public bool SpeakerPick { get; set; }

        public int AllBansCount { get => this.PlayerCount * this.BansPerRound * this.BanRounds; }
    }
}
