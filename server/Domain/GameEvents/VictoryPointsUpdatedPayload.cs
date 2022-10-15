namespace Server.Domain
{
    public class VictoryPointsUpdatedPayload
    {
        public string Faction { get; set; }

        public int Points { get; set; }

        public VictoryPointSource Source { get; set; }

        public string Context { get; set; }
    }
}
