using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Server.Domain;
using Server.Infra;
using Server.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SessionListController : ControllerBase
    {
        private readonly ILogger<SessionListController> logger;
        private readonly SessionContext sessionContext;
        private readonly ITimeProvider timeProvider;
        private readonly IConfiguration configuration;
        private readonly IRepository repository;
        private readonly Authorization authorization;

        public SessionListController(
            ILogger<SessionListController> logger,
            SessionContext sessionContext,
            ITimeProvider timeProvider,
            IConfiguration configuration,
            IRepository repository,
            Authorization authorization)
        {
            this.logger = logger;
            this.sessionContext = sessionContext;
            this.timeProvider = timeProvider;
            this.configuration = configuration;
            this.repository = repository;
            this.authorization = authorization;
        }

        [HttpPost]
        public async Task<SessionListIdDto> CreateSessionList(Guid[] sessionIds)
        {
            var sessions = this.sessionContext.Sessions.Where(session => sessionIds.Contains(session.Id)).ToList();

            var id = await this.GenerateUniqueId();
            await this.sessionContext.SessionLists.AddAsync(new SessionList
            {
                Id = id,
                CreatedAt = this.timeProvider.Now,
                Sessions = sessions,
            });
            sessions.ForEach(s => this.sessionContext.Entry(s).State = EntityState.Modified);
            await this.sessionContext.SaveChangesAsync();

            return new SessionListIdDto
            {
                SessionId = id,
            };
        }

        [HttpGet("{listId}")]
        public async Task<ActionResult<IEnumerable<SessionDto>>> GetSessionsFromList(string listId)
        {
            var sessionList = await this.sessionContext.SessionLists.FindAsync(listId);

            if (sessionList == null)
            {
                return new NotFoundResult();
            }

            await this.sessionContext.Entry(sessionList)
                .Collection(s => s.Sessions)
                .LoadAsync();

            var sessionsFromDb = sessionList.Sessions.OrderByDescending(session => session.CreatedAt);

            return new OkObjectResult(sessionsFromDb.Select(fromDb =>
            {
                this.sessionContext.Entry(fromDb).Collection(s => s.Events)
                .Load();

                return new SessionDto(fromDb);
            }));
        }

        private async Task<string> GenerateUniqueId()
        {
            var generatedAndUnique = false;
            var id = string.Empty;
            var offset = 0;

            while (!generatedAndUnique)
            {
                var now = this.timeProvider.Now;
                char[] chars = new char[7];
                chars[0] = (char)(65 + (now.Year % 25));
                chars[1] = (char)(65 + now.Month);
                chars[2] = (char)(65 + (now.Day % 25));
                chars[3] = (char)(65 + now.Hour);
                chars[4] = (char)(65 + (now.Minute % 25));
                chars[5] = (char)(65 + (now.Second % 25));
                chars[6] = (char)(65 + ((now.Millisecond + offset) % 25));

                id = new string(chars);
                generatedAndUnique = !(await this.sessionContext.SessionLists.AnyAsync(sl => sl.Id == id));
                offset++;
            }

            return id;
        }

        public class SessionListIdDto
        {
            public string SessionId { get; set; }
        }
    }
}
