using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using server.Domain;
using server.Persistence;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/sessions/{sessionId:guid}/[controller]")]
    public class TimelineController : ControllerBase
    {
        private readonly ILogger<SessionsController> logger;
        private readonly IRepository repository;
        private readonly IConfiguration configuration;
        private readonly ITimeProvider timeProvider;
        private readonly SessionContext sessionContext;

        public TimelineController(
            ILogger<SessionsController> logger,
            IRepository repository,
            IConfiguration configuration,
            ITimeProvider timeProvider,
            SessionContext sessionContext)
        {
            this.logger = logger;
            this.repository = repository;
            this.configuration = configuration;
            this.timeProvider = timeProvider;
            this.sessionContext = sessionContext;
        }

        [HttpPost]
        public async Task<ActionResult> AddEvent([FromRoute] Guid sessionId)
        {
            var title = this.HttpContext.Request.Form["title"];
            var description = this.HttpContext.Request.Form["description"];
            var imageFile = this.HttpContext.Request.Form.Files["image"];

            if (string.IsNullOrEmpty(title) && string.IsNullOrEmpty(description) && imageFile == null)
            {
                return new BadRequestResult();
            }

            var eventId = Guid.NewGuid();
            string fileUri = string.Empty;
            if (imageFile != null)
            {
                if (imageFile.Length > 3000000)
                {
                    return new BadRequestResult();
                }

                var sessionBlobContainer = new BlobContainerClient(this.configuration.GetConnectionString("BlobStorage"), sessionId.ToString());
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
                HappenedAt = this.timeProvider.Now,
                EventType = GameEvent.TimelineUserEvent,
                SerializedPayload = JsonConvert.SerializeObject(new
                {
                    file = fileUri,
                    title = this.HttpContext.Request.Form["title"].ToString(),
                    description = this.HttpContext.Request.Form["description"].ToString(),
                }),
            };
            await this.sessionContext.Events.AddAsync(gameEvent);
            await this.sessionContext.SaveChangesAsync();

            return new OkResult();
        }

        [HttpGet]
        public async Task<IEnumerable<TimelineEvent>> Get([FromRoute] Guid sessionId)
        {
            var sessionFromDb = await this.repository.GetByIdWithEvents(sessionId);
            var timeline = new Timeline(sessionFromDb);

            return timeline
                .AddSessionSummary()
                .AddDraftSummary()
                .Deduplicate()
                .CalculateDeltas()
                .GetEvents();
        }
    }
}
