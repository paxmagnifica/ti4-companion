using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using server.Domain;
using server.Persistence;
using server.Infra;

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
            var objectivesFromDb = _sessionContext.Objectives.ToList();

            return objectivesFromDb.Select(fromDb => new ObjectiveDto(fromDb));
        }

        [HttpGet("{slug}")]
        public async Task<ActionResult<ObjectiveDto>> GetObjective(Guid id)
        {
            throw new NotImplementedException();
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
