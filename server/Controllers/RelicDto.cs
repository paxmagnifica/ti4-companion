using Server.Domain;

namespace Server.Controllers
{
    public class RelicDto : Card
    {
        public RelicDto(Relic relic)
        {
            this.Slug = relic.Slug;
            this.GameVersion = relic.GameVersion;
        }
    }
}
