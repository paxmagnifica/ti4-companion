namespace Server.Domain
{
    public class BannedPayload
    {
        public string[] Bans { get; set; }

        public int PlayerIndex { get; set; }

        public string PlayerName { get; set; }
    }
}
