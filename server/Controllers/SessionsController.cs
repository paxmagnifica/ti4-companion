using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using server.Domain;
using server.Persistence;

namespace server.Controllers
{
    public class SessionDto: Session
    {
        public SessionDto(Session session)
        {
            Id = session.Id;
            CreatedAt = session.CreatedAt;
            Factions = session.Factions;
            SetPoints(session.Events);
        }

        public List<FactionPoint> Points { get; internal set; }

        private void SetPoints(List<GameEvent> events)
        {
            Dictionary<string, int> points = new Dictionary<string, int>();

            foreach (var faction in Factions)
            {
                points[faction] = 0;
            }

            IEnumerable<GameEvent> victoryPointEvents = (events ?? new List<GameEvent>())
                .Where(ge => ge.EventType == nameof(VictoryPointsUpdated))
                .OrderBy(ge => ge.HappenedAt);
            foreach (var gameEvent in victoryPointEvents)
            {
                // TODO isn't this hacky and ugly? :(
                var payload = VictoryPointsUpdated.GetPayload(gameEvent);
                points[payload.Faction] = payload.Points;
            }

            Points = points.ToArray().Select(kvp => new FactionPoint
            {
                Faction = kvp.Key,
                Points = kvp.Value
            }).ToList();
        }
    }

    public class FactionPoint
    {
        public string Faction { get; set; }
        public int Points { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class SessionsController : ControllerBase
    {
        private readonly ILogger<SessionsController> _logger;
        private readonly SessionContext _sessionContext;

        public SessionsController(ILogger<SessionsController> logger, SessionContext sessionContext)
        {
            _logger = logger;
            _sessionContext = sessionContext;
        }

        [HttpPost]
        public async Task<ActionResult<Session>> Post(List<string> factions)
        {
            var newSession = new Session { Id = Guid.NewGuid(), CreatedAt = DateTimeOffset.UtcNow, Factions = factions };
            await _sessionContext.Sessions.AddAsync(newSession);
            await _sessionContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSession), new { id = newSession.Id }, new SessionDto(newSession));
        }

        [HttpGet]
        public async Task<IEnumerable<SessionDto>> GetSessions()
        {
            var sessionsFromDb = await _sessionContext.Sessions.OrderByDescending(session => session.CreatedAt).ToListAsync();

            return sessionsFromDb.Select(fromDb => new SessionDto(fromDb));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SessionDto>> GetSession(Guid id)
        {
            var sessionFromDb = await _sessionContext.Sessions.FindAsync(id);
            _sessionContext.Entry(sessionFromDb)
                .Collection(session => session.Events)
                .Load();

            if (sessionFromDb == null)
            {
                return new NotFoundResult();
            }

            return new SessionDto(sessionFromDb);
        }
    }
}
