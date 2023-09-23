namespace Server.Domain
{
    public class CommitDraftPayload
    {
        public CommitDraftPayload()
        {
            Factions = new string[0];
            TablePositions = new int[0];
            Initiative = new int[0];
        }

        public string[] Factions { get; set; }
        public int[] TablePositions { get; set; }
        public int[] Initiative { get; set; }
    }
}
