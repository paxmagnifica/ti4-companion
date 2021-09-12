namespace server.Domain
{
    public class Objective : Card
    {
        public Objective() : base()
        {
            Reward = Reward.VictoryPoint;
        }

        public Objective(string slug, GameVersion gameVersion, int points, bool secret, GamePhase phase) : base(slug, gameVersion)
        {
            Points = points;
            Secret = secret;
            When = phase;
            Reward = Reward.VictoryPoint;
        }

        public int Points { get; set; }
        public bool Secret { get; set; }
        public GamePhase When { get; set; }
        public Reward Reward { get; set; }
    }
}
