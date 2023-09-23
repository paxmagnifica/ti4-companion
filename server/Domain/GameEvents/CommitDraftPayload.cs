namespace Server.Domain
{
    public class CommitDraftPayload
    {
        public CommitDraftPayload()
        {
            this.Factions = new string[0];
            this.TablePositions = new int[0];
            this.Initiative = new int[0];
        }

        public string[] Factions { get; set; }

        public int[] TablePositions { get; set; }

        public int[] Initiative { get; set; }
    }
}
