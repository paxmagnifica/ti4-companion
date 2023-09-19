namespace Server.Domain
{
    public class DraftOptions
    {
        public DraftOptions()
        {
            this.InitialPool = new string[0];
            this.Players = new string[0];
            this.MapPositions = new MapPosition[0];
        }

        public DraftOptions(DraftOptions options)
        {
            InitialPool = (string[]) options.InitialPool.Clone();
            Players = (string[]) options.Players.Clone();
            MapPositions = (MapPosition[]) options.MapPositions.Clone();
            Bans = options.Bans;
            BanRounds = options.BanRounds;
            BansPerRound = options.BansPerRound;
            TablePick = options.TablePick;
            SpeakerPick = options.SpeakerPick;
        }

        public string[] InitialPool { get; set; }

        public string[] Players { get; set; }

        public MapPosition[] MapPositions { get; set; }

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
