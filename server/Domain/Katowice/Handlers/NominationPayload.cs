namespace Server.Domain.Katowice
{
    public class NominationPayload
    {
        public string Action { get; set; }
        public string Faction { get; set; }
        public int PlayerIndex { get; set; }
    }
}
