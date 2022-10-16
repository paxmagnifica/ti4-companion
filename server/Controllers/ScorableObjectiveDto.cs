using System.Collections.Generic;

namespace Server.Controllers
{
    public class ScorableObjectiveDto
    {
        public string Slug { get; set; }

        public List<string> ScoredBy { get; set; }
    }
}
