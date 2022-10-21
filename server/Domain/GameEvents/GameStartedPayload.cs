using System.Collections.Generic;

namespace Server.Domain
{
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
}
