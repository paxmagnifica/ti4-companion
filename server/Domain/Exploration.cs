
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Domain
{
    public class Exploration : Card
    {
        public Exploration()
            : base()
        {
            this.Influence = 0;
            this.Resources = 0;
        }

        public Exploration(
            string slug,
            GameVersion gameVersion,
            PlanetType planetType,
            int numberOfCards,
            int additionalInfluence,
            int additionalResources,
            Technology? techSkip = null)
            : base(slug, gameVersion)
        {
            this.PlanetType = planetType;
            this.NumberOfCards = numberOfCards;
            this.Influence = additionalInfluence;
            this.Resources = additionalResources;
            this.TechSkip = techSkip;
        }

        public PlanetType PlanetType { get; set; }

        public int NumberOfCards { get; set; }

        public int Resources { get; set; }

        public int Influence { get; set; }

        public Technology? TechSkip { get; set; }

        [NotMapped]
        public bool Relic => this.Slug.Contains("-relic-");

        [NotMapped]
        public bool Attachment => this.Influence > 0 || this.Resources > 0;
    }
}
