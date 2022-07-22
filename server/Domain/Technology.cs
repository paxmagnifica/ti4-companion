namespace server.Domain
{
    public class Technology : Card
    {
        public Technology(string slug, GameVersion gameVersion) : base(slug, gameVersion)
        {
        }

        public TechnologyType Type { get; set; }
        public int Level { get; set; }
    }
}
