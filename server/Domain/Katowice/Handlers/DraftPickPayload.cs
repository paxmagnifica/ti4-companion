namespace Server.Domain.Katowice
{
    public class DraftPickPayload
    {
        public string Action { get; set; }

        public string Choice { get; set; }

        public int PlayerIndex { get; set; }
    }
}
