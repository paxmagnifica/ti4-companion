namespace Server.Domain
{
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
