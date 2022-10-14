using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Server.Domain;
using Server.Persistence;
using System.Collections.Generic;
using System.Linq;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ObjectivesController : ControllerBase
    {
        private readonly ILogger<ObjectivesController> logger;
        private readonly SessionContext sessionContext;
        private readonly ITimeProvider timeProvider;

        public ObjectivesController(ILogger<ObjectivesController> logger, SessionContext sessionContext, ITimeProvider timeProvider)
        {
            this.logger = logger;
            this.sessionContext = sessionContext;
            this.timeProvider = timeProvider;
        }

        [HttpGet]
        public IEnumerable<ObjectiveDto> GetObjectives()
        {
            var gameVersionInContext = (GameVersion)this.HttpContext.Items["GameVersion"];
            var objectivesFromDb = this.sessionContext.Objectives.Where(o => o.GameVersion <= gameVersionInContext).OrderBy(o => o.Slug).ToList();

            return objectivesFromDb.Select(fromDb => new ObjectiveDto(fromDb));
        }
    }
}
