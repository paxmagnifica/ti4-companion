using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using server.Domain;
using server.Persistence;
using Microsoft.Extensions.Configuration;
using server.Infra;
using System.Linq;

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

        [HttpGet("{listId}")]
        public async Task<IEnumerable<SessionDto>> GetSessionsFromList(string listId)
        {
            var sessionList = await _sessionContext.SessionLists.FindAsync(listId);
            await _sessionContext.Entry(sessionList)
                .Collection(s => s.Sessions)
                .LoadAsync();

            var sessionsFromDb = sessionList.Sessions.OrderByDescending(session => session.CreatedAt);

            return sessionsFromDb.Select(fromDb =>
            {
                _sessionContext.Entry(fromDb).Collection(s => s.Events)
                .Load();

                return new SessionDto(fromDb);
            });
        }

    }
}
