using Server.Domain;

namespace Server.Controllers
{
    public class ObjectiveDto : Objective
    {
        public ObjectiveDto(Objective objective)
        {
            this.Slug = objective.Slug;
            this.GameVersion = objective.GameVersion;
            this.Points = objective.Points;
            this.Secret = objective.Secret;
            this.When = objective.When;
            this.Reward = objective.Reward;
        }
    }
}
