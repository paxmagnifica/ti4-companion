using System.ComponentModel.DataAnnotations.Schema;

namespace server.Domain
{
    public class Exploration : Card
    {
        public Exploration() : base()
        {
            Influence = 0;
            Resources = 0;
        }

        public Exploration(
            string slug,
            GameVersion gameVersion,
            PlanetType planetType,
            int numberOfCards,
            int additionalInfluence,
            int additionalResources,
            Technology? techSkip = null
        ) : base(slug, gameVersion)
        {
            PlanetType = planetType;
            NumberOfCards = numberOfCards;
            Influence = additionalInfluence;
            Resources = additionalResources;
            TechSkip = techSkip;
        }

        public PlanetType PlanetType { get; set; }
        public int NumberOfCards { get; set; }
        public int Resources { get; set; }
        public int Influence { get; set; }
        public Technology? TechSkip { get; set; }
        [NotMapped]
        public bool Relic => Slug.Contains("-relic-");
        [NotMapped]
        public bool Attachment => Influence > 0 || Resources > 0;
    }
}
