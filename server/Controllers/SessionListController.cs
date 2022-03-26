using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using server.Domain;
using server.Persistence;
using Microsoft.Extensions.Configuration;
using server.Infra;
using System.Linq;
using System;
using Microsoft.EntityFrameworkCore;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SessionListController : ControllerBase
    {
        private readonly ILogger<SessionListController> _logger;
        private readonly SessionContext _sessionContext;
        private readonly ITimeProvider _timeProvider;
        private readonly IConfiguration _configuration;
        private readonly IRepository _repository;
        private readonly Authorization _authorization;

        public SessionListController(
            ILogger<SessionListController> logger,
            SessionContext sessionContext,
            ITimeProvider timeProvider,
            IConfiguration configuration,
            IRepository repository,
            Authorization authorization
        )
        {
            _logger = logger;
            _sessionContext = sessionContext;
            _timeProvider = timeProvider;
            _configuration = configuration;
            _repository = repository;
            _authorization = authorization;
        }

        public class SessionListIdDto
        {
            public string SessionId { get; set; }
        }
        [HttpPost]
        public async Task<SessionListIdDto> CreateSessionList(Guid[] sessionIds)
        {
            var sessions = _sessionContext.Sessions.Where(session => sessionIds.Contains(session.Id)).ToList();

            var id = await GenerateUniqueId();
            await _sessionContext.SessionLists.AddAsync(new SessionList
            {
                Id = id,
                CreatedAt = _timeProvider.Now,
                Sessions = sessions
            });
            sessions.ForEach(s => _sessionContext.Entry(s).State = EntityState.Modified);
            await _sessionContext.SaveChangesAsync();

            return new SessionListIdDto
            {
                SessionId = id,
            };
        }

        private async Task<string> GenerateUniqueId()
        {
            var generatedAndUnique = false;
            var id = string.Empty;
            var offset = 0;

            while (!generatedAndUnique)
            {
                var now = _timeProvider.Now;
                char[] chars = new char[7];
                chars[0] = (char)(65 + now.Year % 25);
                chars[1] = (char)(65 + now.Month);
                chars[2] = (char)(65 + now.Day % 25);
                chars[3] = (char)(65 + now.Hour);
                chars[4] = (char)(65 + now.Minute % 25);
                chars[5] = (char)(65 + now.Second % 25);
                chars[6] = (char)(65 + (now.Millisecond + offset) % 25);

                id = new string(chars);
                generatedAndUnique = !(await _sessionContext.SessionLists.AnyAsync(sl => sl.Id == id));
                offset++;
            }

            return id;
        }

        [HttpGet("{listId}")]
        public async Task<ActionResult<IEnumerable<SessionDto>>> GetSessionsFromList(string listId)
        {
            var sessionList = await _sessionContext.SessionLists.FindAsync(listId);

            if (sessionList == null) {
                return new NotFoundResult();
            }

            await _sessionContext.Entry(sessionList)
                .Collection(s => s.Sessions)
                .LoadAsync();

            var sessionsFromDb = sessionList.Sessions.OrderByDescending(session => session.CreatedAt);

            return new OkObjectResult(sessionsFromDb.Select(fromDb =>
            {
                _sessionContext.Entry(fromDb).Collection(s => s.Events)
                .Load();

                return new SessionDto(fromDb);
            }));
        }

    }
}
