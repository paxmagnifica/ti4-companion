using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using server.Domain;
using server.Persistence;
using server.Infra;
using Newtonsoft.Json;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SessionsController : ControllerBase
    {
        private readonly ILogger<SessionsController> _logger;
        private readonly SessionContext _sessionContext;
        private readonly ITimeProvider _timeProvider;

        public SessionsController(ILogger<SessionsController> logger, SessionContext sessionContext, ITimeProvider timeProvider)
        {
            _logger = logger;
            _sessionContext = sessionContext;
            _timeProvider = timeProvider;
        }

        [HttpPost]
        public async Task<ActionResult<Session>> Post(List<string> factions)
        {
            var sessionId = Guid.NewGuid();
            var newSession = new Session { Id = sessionId, CreatedAt = _timeProvider.Now };
            newSession.Events = new List<GameEvent> {
                new GameEvent {
                    Id = Guid.NewGuid(),
                    SessionId = sessionId,
                    HappenedAt = _timeProvider.Now,
                    EventType = GameEvent.GameStarted,
                    SerializedPayload = JsonConvert.SerializeObject(factions)
                }
            };
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
