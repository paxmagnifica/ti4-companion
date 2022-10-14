namespace Server.Domain
{
    public class AgendaVotedOnPayload
    {
        public string Slug { get; set; }

        public VoteResult Result { get; set; }

        public string Election { get; set; }

        public AgendaType Type { get; set; }
    }
}
