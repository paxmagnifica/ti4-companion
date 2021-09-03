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
    [Route("sessions")]
    public class SessionsController : ControllerBase
    {
        private readonly ILogger<SessionsController> _logger;
        private readonly SessionContext _sessionContext;

        public SessionsController(ILogger<SessionsController> logger, SessionContext sessionContext)
        {
            _logger = logger;
            _sessionContext = sessionContext;
        }

        [HttpGet]
        public async Task<IEnumerable<SessionDto>> Get()
        {
            var sessionsFromDb = await _sessionContext.Sessions.Take(5).ToListAsync();

            return sessionsFromDb.Select(fromDb => new SessionDto(fromDb));
        }
    }
}
