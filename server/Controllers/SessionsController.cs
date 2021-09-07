using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using server.Domain;
using Microsoft.EntityFrameworkCore;

namespace server.Controllers
{
    public class SessionDto
    {
        public SessionDto() { }
        public SessionDto(Session session)
        {
            Id = session.Id;
            CreatedAt = session.CreatedAt;
            Factions = session.Factions;
        }

        public Guid Id { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public List<string> Factions { get; set; }
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

            return CreatedAtAction(nameof(GetSession), new { id = newSession.Id }, newSession);
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

            if (sessionFromDb == null)
            {
                return new NotFoundResult();
            }

            return new SessionDto(sessionFromDb);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(Guid id, SessionDto sessionDto)
        {
            if (id != sessionDto.Id)
            {
                return BadRequest();
            }

            var session = new Session() { Id = sessionDto.Id, CreatedAt = sessionDto.CreatedAt, Factions = sessionDto.Factions };
            _sessionContext.Entry(session).State = EntityState.Modified;

            try
            {
                await _sessionContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_sessionContext.Sessions.Any(s => s.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
    }
}
