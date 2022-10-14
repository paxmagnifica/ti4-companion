using Server.Domain;

namespace Server.Controllers
{
    public class ExplorationCardDto : Exploration
    {
        public ExplorationCardDto(Exploration exploration)
        {
            this.Slug = exploration.Slug;
            this.GameVersion = exploration.GameVersion;
            this.PlanetType = exploration.PlanetType;
            this.NumberOfCards = exploration.NumberOfCards;
            this.Resources = exploration.Resources;
            this.Influence = exploration.Influence;
            this.TechSkip = exploration.TechSkip;
        }
    }
}
