//

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using server.Domain;
using server.Persistence;
using System.Collections.Generic;
using System.Linq;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RelicsController : ControllerBase
    {
        private readonly ILogger<RelicsController> logger;
        private readonly SessionContext sessionContext;

        public RelicsController(ILogger<RelicsController> logger, SessionContext sessionContext)
        {
            this.logger = logger;
            this.sessionContext = sessionContext;
        }

        [HttpGet]
        public IEnumerable<RelicDto> GetObjectives()
        {
            var objectivesFromDb = this.sessionContext.Relics.ToList();

            return objectivesFromDb.Select(fromDb => new RelicDto(fromDb));
        }
    }

    public class RelicDto : Card
    {
        public RelicDto(Relic relic)
        {
            Slug = relic.Slug;
            GameVersion = relic.GameVersion;
        }
    }
}
