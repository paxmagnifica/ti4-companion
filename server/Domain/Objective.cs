namespace Server.Domain
{
    public class Objective : Card
    {
        public Objective()
            : base()
        {
            this.Reward = Reward.VictoryPoint;
        }

        public Objective(string slug, GameVersion gameVersion, int points, bool secret, GamePhase phase)
            : base(slug, gameVersion)
        {
            this.Points = points;
            this.Secret = secret;
            this.When = phase;
            this.Reward = Reward.VictoryPoint;
        }

        public int Points { get; set; }

        public bool Secret { get; set; }

        public GamePhase When { get; set; }

        public Reward Reward { get; set; }
    }
}
