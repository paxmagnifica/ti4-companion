using System.Collections.Generic;

namespace Server.Domain
{
    public class GameStartedPayload
    {
        public GameStartedPayload()
        {
            this.Factions = new List<string>();
            this.GameVersion = GameVersion.PoK_Codex3;
            this.RandomPlayerOrder = new int[0];
        }

        public GameStartedPayload(GameStartedPayload payload)
        {
            this.SetupType = payload.SetupType;
            this.Factions = new List<string>(payload.Factions);
            this.GameVersion = payload.GameVersion;
            this.Options = new DraftOptions(payload.Options);
            this.Password = payload.Password;
            this.RandomPlayerOrder = (int[])payload.RandomPlayerOrder.Clone();
        }

        public string SetupType { get; set; }

        public List<string> Factions { get; set; }

        public GameVersion GameVersion { get; set; }

        public DraftOptions Options { get; set; }

        public string Password { get; set; }

        public int[] RandomPlayerOrder { get; set; }
    }
}
