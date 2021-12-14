using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using server.Domain;
using server.Infra;
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
        private readonly ITimelineModifiers _timelineModifiers;

        public TimelineController(
            ILogger<SessionsController> logger,
            IRepository repository,
            IConfiguration configuration,
            ITimeProvider timeProvider,
            SessionContext sessionContext,
            ITimelineModifiers timelineModifiers)
        {
            this._logger = logger;
            this._repository = repository;
            this._configuration = configuration;
            this._timeProvider = timeProvider;
            this._sessionContext = sessionContext;
            _timelineModifiers = timelineModifiers;
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

            var defaultVpCount = 10;
            var previousVpCount = defaultVpCount;
            var orderedEvents = sessionFromDb.Events.OrderBy(e => e.HappenedAt);

            var timelineEvents = new List<KeyValuePair<GameEvent, TimelineEvent>>();

            foreach (var sessionEvent in orderedEvents)
            {
                if (sessionEvent.EventType == nameof(MetadataUpdated))
                {
                    var payload = MetadataUpdated.GetPayload(sessionEvent);
                    if (payload.VpCount == previousVpCount)
                    {
                        continue;
                    }
                    var newPayload = JsonConvert.SerializeObject(new { from = previousVpCount, to = payload.VpCount });
                    previousVpCount = payload.VpCount;
                    timelineEvents.Add(KeyValuePair.Create(sessionEvent, new TimelineEvent
                    {
                        EventType = "VpCountChanged",
                        SerializedPayload = newPayload,
                        HappenedAt = sessionEvent.HappenedAt
                    }));

                    continue;
                }

                if (sessionEvent.EventType == nameof(ObjectiveScored))
                {
                    var payload = ObjectiveScored.GetPayload(sessionEvent);
                    if (timelineEvents.Last().Key.EventType == nameof(VictoryPointsUpdated))
                    {
                        var lastPayload = VictoryPointsUpdated.GetPayload(timelineEvents.Last().Key);

                        if (lastPayload.Faction == payload.Faction)
                        {
                            timelineEvents.RemoveAt(timelineEvents.Count - 1);
                            timelineEvents.Add(KeyValuePair.Create(sessionEvent, new TimelineEvent
                            {
                                EventType = sessionEvent.EventType,
                                SerializedPayload = JsonConvert.SerializeObject(new
                                {
                                    faction = payload.Faction,
                                    points = lastPayload.Points,
                                    slug = payload.Slug,
                                }),
                                HappenedAt = sessionEvent.HappenedAt
                            }));

                            continue;
                        }
                    }
                }

                if (sessionEvent.EventType == nameof(VictoryPointsUpdated))
                {
                    var payload = VictoryPointsUpdated.GetPayload(sessionEvent);
                    if (timelineEvents.Last().Key.EventType == nameof(ObjectiveScored))
                    {
                        var lastPayload = ObjectiveScored.GetPayload(timelineEvents.Last().Key);

                        if (lastPayload.Faction == payload.Faction)
                        {
                            timelineEvents.RemoveAt(timelineEvents.Count - 1);
                            timelineEvents.Add(KeyValuePair.Create(sessionEvent, new TimelineEvent
                            {
                                EventType = nameof(ObjectiveScored),
                                SerializedPayload = JsonConvert.SerializeObject(new
                                {
                                    faction = payload.Faction,
                                    points = payload.Points,
                                    slug = lastPayload.Slug,
                                }),
                                HappenedAt = sessionEvent.HappenedAt
                            }));

                            continue;
                        }
                    }
                }
#if DEBUG
                if (sessionEvent.EventType == GameEvent.TimelineUserEvent || sessionEvent.EventType == GameEvent.MapAdded)
                {
                    timelineEvents.Add(KeyValuePair.Create(sessionEvent, new TimelineEvent
                    {
                        EventType = sessionEvent.EventType,
                        SerializedPayload = sessionEvent.SerializedPayload.Replace("storage-emulator", "localhost"),
                        HappenedAt = sessionEvent.HappenedAt
                    }));
                    continue;
                }
#endif

                timelineEvents.Add(KeyValuePair.Create(sessionEvent, new TimelineEvent
                {
                    EventType = sessionEvent.EventType,
                    SerializedPayload = sessionEvent.SerializedPayload,
                    HappenedAt = sessionEvent.HappenedAt
                }));
            }

            var dtos = timelineEvents.Select(kvp => kvp.Value).Select((e, index) =>
            {
                e.Order = index;
                return e;
            });

            return _timelineModifiers.AddDraftSummary(_timelineModifiers.Deduplicate(dtos));
        }
    }
}
