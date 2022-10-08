using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Server.Domain;
using Server.Infra;
using Server.Persistence;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SessionsController : ControllerBase
    {
        private readonly ILogger<SessionsController> logger;
        private readonly SessionContext sessionContext;
        private readonly ITimeProvider timeProvider;
        private readonly IConfiguration configuration;
        private readonly IRepository repository;
        private readonly Authorization authorization;

        public SessionsController(
            ILogger<SessionsController> logger,
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
        public async Task<ActionResult<Session>> Post(GameStartedPayload payload)
        {
            var sessionId = Guid.NewGuid();
            var newSession = new Session { Id = sessionId, CreatedAt = this.timeProvider.Now };
            newSession.Events = new List<GameEvent>
            {
                new GameEvent
                {
                    Id = Guid.NewGuid(),
                    SessionId = sessionId,
                    HappenedAt = this.timeProvider.Now,
                    EventType = GameEvent.GameStarted,
                    SerializedPayload = JsonConvert.SerializeObject(payload),
                },
            };

            if (payload.SetupType == "draft")
            {
                newSession.Events.Add(GameEvent.GenerateOrderEvent(sessionId, payload, payload.Options.BanRounds, this.timeProvider.Now, addForSpeaker: false));
            }

            await this.repository.SaveSessionToListAsync(this.HttpContext.Items["ListIdentifier"].ToString(), newSession);
            await this.sessionContext.SaveChangesAsync();

            var dto = new SessionDto(newSession);
            dto.Secret = (await this.authorization.GenerateTokenFor(sessionId)).Value;
            if (!string.IsNullOrWhiteSpace(payload.Password))
            {
                dto.Secured = true;
                FormattableString commandText = $"UPDATE \"Sessions\" SET \"HashedPassword\"=crypt({payload.Password}, gen_salt('bf')) WHERE \"Id\"={sessionId}";
                this.sessionContext.Database.ExecuteSqlInterpolated(commandText);
            }

            return this.CreatedAtAction(nameof(this.GetSession), new { sessionId = newSession.Id }, dto);
        }

        [HttpGet("{sessionId}")]
        public async Task<ActionResult<SessionDto>> GetSession(Guid sessionId)
        {
            var sessionFromDb = await this.repository.GetByIdWithEvents(sessionId);
            if (sessionFromDb == null)
            {
                return new NotFoundResult();
            }

            await this.repository.RememberSessionInList(this.HttpContext.Items["ListIdentifier"].ToString(), sessionFromDb);
            await this.repository.SaveChangesAsync();

            var sessionDto = new SessionDto(sessionFromDb);

            return sessionDto;
        }

        [HttpPost("{sessionId}/edit")]
        public async Task<ActionResult> ExchangePasswordForSecret([FromRoute] Guid sessionId, [FromBody] PasswordPayload pp)
        {
            var passwordCorrect = await this.authorization.CheckPassword(sessionId, pp.Password);
            if (!passwordCorrect)
            {
                return new UnauthorizedResult();
            }

            var token = await this.authorization.GenerateTokenFor(sessionId);
            return new OkObjectResult(new { secret = token.Value });
        }

        // TODO not cool, direct Events and stuff
        [HttpPost("{sessionId}/map")]
        public async Task<ActionResult> UploadMap(Guid sessionId)
        {
            var mapFile = this.HttpContext.Request.Form.Files["map"];

            if (mapFile.Length > 3000000)
            {
                return new BadRequestResult();
            }

            var sessionBlobContainer = new BlobContainerClient(this.configuration.GetConnectionString("BlobStorage"), sessionId.ToString());
            await sessionBlobContainer.CreateIfNotExistsAsync(PublicAccessType.Blob);

            var mapBlobClient = sessionBlobContainer.GetBlobClient("map");
            var blobHttpHeader = new BlobHttpHeaders();
            blobHttpHeader.ContentType = mapFile.ContentType;
            await mapBlobClient.UploadAsync(mapFile.OpenReadStream(), blobHttpHeader);

            var gameEvent = new GameEvent
            {
                Id = Guid.NewGuid(),
                SessionId = sessionId,
                HappenedAt = this.timeProvider.Now,
                EventType = GameEvent.MapAdded,
                SerializedPayload = mapBlobClient.Uri.ToString(),
            };
            await this.sessionContext.Events.AddAsync(gameEvent);
            await this.sessionContext.SaveChangesAsync();

            return new OkResult();
        }

        public class PasswordPayload
        {
            public string Password { get; set; }
        }
    }
}
