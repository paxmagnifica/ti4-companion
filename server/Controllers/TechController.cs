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
    public class TechController : ControllerBase
    {
        private readonly ILogger<TechController> _logger;
        private readonly SessionContext _sessionContext;

        public TechController(ILogger<TechController> logger, SessionContext sessionContext)
        {
            _logger = logger;
            _sessionContext = sessionContext;
        }

        [HttpGet]
        public TechPayloadDto GetTech()
        {
            var gameVersionInContext = (GameVersion)HttpContext.Items["GameVersion"];
            var techs = _sessionContext.Techs.Where(t => t.GameVersion <= gameVersionInContext).ToList().Select(fromDb => new TechnologyDto(fromDb));
            var units = _sessionContext.Units.Where(t => t.GameVersion <= gameVersionInContext).ToList().Select(fromDb => new UnitDto(fromDb));

            return new TechPayloadDto
            {
                Techs = techs,
                Units = units
            };
        }
    }

    public class TechPayloadDto
    {
        public IEnumerable<TechnologyDto> Techs { get; set; }
        public IEnumerable<UnitDto> Units { get; set; }
    }

    public class TechnologyDto : Technology
    {
        public TechnologyDto(Technology fromDb) : base(fromDb.Slug, fromDb.GameVersion)
        {
            Type = fromDb.Type;
            Level = fromDb.Level;
            Faction = fromDb.Faction;
        }
    }

    public class UnitDto : Unit
    {
        public UnitDto(Unit fromDb) : base(fromDb.Slug, fromDb.GameVersion)
        {
            Level = fromDb.Level;
            Requirements = fromDb.Requirements;
            Cost = fromDb.Cost;
            Combat = fromDb.Combat;
            CombatDice = fromDb.CombatDice;
            Move = fromDb.Move;
            Capacity = fromDb.Capacity;
            Production = fromDb.Production;
            SustainDamage = fromDb.SustainDamage;
            PlanetaryShield = fromDb.PlanetaryShield;
            AntiFighterBarrage = fromDb.AntiFighterBarrage;
            AntiFighterBarrageDice = fromDb.AntiFighterBarrageDice;
            Bombardment = fromDb.Bombardment;
            BombardmentDice = fromDb.BombardmentDice;
            Faction = fromDb.Faction;
        }
    }
}
