using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using server.Domain;
using server.Persistence;

namespace server.Controllers
{
    [ApiController]
    [Route("api/sessions/{sessionId:guid}/[controller]")]
    public class TimelineController : ControllerBase
    {
        private readonly ILogger<SessionsController> _logger;
        private readonly IRepository _repository;
        private readonly IConfiguration _configuration;
        private readonly ITimeProvider _timeProvider;
        private readonly SessionContext _sessionContext;

        public TimelineController(
            ILogger<SessionsController> logger,
            IRepository repository,
            IConfiguration configuration,
            ITimeProvider timeProvider,
            SessionContext sessionContext
            )
        {
            this._logger = logger;
            this._repository = repository;
            this._configuration = configuration;
            this._timeProvider = timeProvider;
            this._sessionContext = sessionContext;
        }

        [HttpPost]
        public async Task<ActionResult> AddEvent([FromRoute] Guid sessionId)
        {
            var title = HttpContext.Request.Form["title"];
            var description = HttpContext.Request.Form["description"];
            var imageFile = HttpContext.Request.Form.Files["image"];

            if (string.IsNullOrEmpty(title) && string.IsNullOrEmpty(description) && imageFile == null)
            {
                return new BadRequestResult();
            }

            var eventId = Guid.NewGuid();
            string fileUri = "";
            if (imageFile != null)
            {
                if (imageFile.Length > 3000000)
                {
                    return new BadRequestResult();
                }

                var sessionBlobContainer = new BlobContainerClient(_configuration.GetConnectionString("BlobStorage"), sessionId.ToString());
                await sessionBlobContainer.CreateIfNotExistsAsync(PublicAccessType.Blob);

                var blobClient = sessionBlobContainer.GetBlobClient($"timeline_event_{eventId}");
                var blobHttpHeader = new BlobHttpHeaders();
                blobHttpHeader.ContentType = imageFile.ContentType;
                await blobClient.UploadAsync(imageFile.OpenReadStream(), blobHttpHeader);
                fileUri = blobClient.Uri.ToString();
            }

            var gameEvent = new GameEvent
            {
                Id = eventId,
                SessionId = sessionId,
                HappenedAt = _timeProvider.Now,
                EventType = GameEvent.TimelineUserEvent,
                SerializedPayload = JsonConvert.SerializeObject(new
                {
                    file = fileUri,
                    title = HttpContext.Request.Form["title"].ToString(),
                    description = HttpContext.Request.Form["description"].ToString()
                }),
            };
            await _sessionContext.Events.AddAsync(gameEvent);
            await _sessionContext.SaveChangesAsync();

            return new OkResult();
        }

        [HttpGet]
        public async Task<IEnumerable<TimelineEvent>> Get([FromRoute] Guid sessionId)
        {
            var sessionFromDb = await _repository.GetByIdWithEvents(sessionId);
            var timeline = new Timeline(sessionFromDb);

            return timeline
                .AddSessionSummary()
                .AddDraftSummary()
                .Deduplicate()
                .GetEvents();
        }
    }
}
