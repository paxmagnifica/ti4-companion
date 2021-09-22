using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using server.Domain;
using server.Persistence;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RelicsController : ControllerBase
    {
        private readonly ILogger<RelicsController> _logger;
        private readonly SessionContext _sessionContext;

        public RelicsController(ILogger<RelicsController> logger, SessionContext sessionContext)
        {
            _logger = logger;
            _sessionContext = sessionContext;
        }

        [HttpGet]
        public IEnumerable<RelicDto> GetObjectives()
        {
            var objectivesFromDb = _sessionContext.Relics.ToList();

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
