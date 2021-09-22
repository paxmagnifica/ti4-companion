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
    public class ExplorationCardsController : ControllerBase
    {
        private readonly ILogger<ExplorationCardsController> _logger;
        private readonly SessionContext _sessionContext;

        public ExplorationCardsController(ILogger<ExplorationCardsController> logger, SessionContext sessionContext)
        {
            _logger = logger;
            _sessionContext = sessionContext;
        }

        [HttpGet]
        public IEnumerable<ExplorationCardDto> GetObjectives()
        {
            var objectivesFromDb = _sessionContext.Explorations.ToList();

            return objectivesFromDb.Select(fromDb => new ExplorationCardDto(fromDb)).OrderBy(f => f.PlanetType);
        }
    }

    public class ExplorationCardDto : Exploration
    {
        public ExplorationCardDto(Exploration exploration)
        {
            Slug = exploration.Slug;
            GameVersion = exploration.GameVersion;
            PlanetType = exploration.PlanetType;
            NumberOfCards = exploration.NumberOfCards;
            Resources = exploration.Resources;
            Influence = exploration.Influence;
            TechSkip = exploration.TechSkip;
        }
    }
}
