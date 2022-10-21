namespace Server.Domain
{
    public class PickedPayload
    {
        public string Pick { get; set; }

        public string Type { get; set; } // "faction", "tablePosition"

        public int PlayerIndex { get; set; }

        public string PlayerName { get; set; }
    }
}
