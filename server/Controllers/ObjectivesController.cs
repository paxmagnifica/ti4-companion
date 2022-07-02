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
    public class ObjectivesController : ControllerBase
    {
        private readonly ILogger<ObjectivesController> _logger;
        private readonly SessionContext _sessionContext;
        private readonly ITimeProvider _timeProvider;

        public ObjectivesController(ILogger<ObjectivesController> logger, SessionContext sessionContext, ITimeProvider timeProvider)
        {
            _logger = logger;
            _sessionContext = sessionContext;
            _timeProvider = timeProvider;
        }

        [HttpGet]
        public IEnumerable<ObjectiveDto> GetObjectives()
        {
            var gameVersionInContext = (GameVersion)HttpContext.Items["GameVersion"];
            var objectivesFromDb = _sessionContext.Objectives.Where(o => o.GameVersion <= gameVersionInContext).ToList();

            return objectivesFromDb.Select(fromDb => new ObjectiveDto(fromDb));
        }
    }

    public class ObjectiveDto : Objective
    {
        public ObjectiveDto(Objective objective)
        {
            Slug = objective.Slug;
            GameVersion = objective.GameVersion;
            Points = objective.Points;
            Secret = objective.Secret;
            When = objective.When;
            Reward = objective.Reward;
        }
    }
}
