using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using server.Domain;

namespace server.Controllers
{
    public class TimelineEventDto
    {
        public int Order { get; set; }
        public string EventType { get; set; }
        public string SerializedPayload { get; set; }
        public DateTimeOffset HappenedAt { get; set; }
    }

    [ApiController]
    [Route("api/sessions/{sessionId:guid}/[controller]")]
    public class TimelineController : ControllerBase
    {
        private readonly ILogger<SessionsController> _logger;
        private readonly IRepository _repository;

        public TimelineController(
            ILogger<SessionsController> logger,
            IRepository repository
        )
        {
            this._logger = logger;
            this._repository = repository;
        }

        [HttpGet]
        public async Task<IEnumerable<TimelineEventDto>> Get([FromRoute] Guid sessionId)
        {
            var sessionFromDb = await _repository.GetByIdWithEvents(sessionId);

            var previousVpCount = 10;
            var orderedEvents = sessionFromDb.Events.OrderBy(e => e.HappenedAt);

            var timelineEvents = new List<KeyValuePair<GameEvent, TimelineEventDto>>();

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
                    timelineEvents.Add(KeyValuePair.Create(sessionEvent, new TimelineEventDto
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
                    if (timelineEvents.Last().Value.EventType == nameof(VictoryPointsUpdated))
                    {
                        var lastPayload = VictoryPointsUpdated.GetPayload(timelineEvents.Last().Key);

                        if (lastPayload.Faction == payload.Faction)
                        {
                            timelineEvents.RemoveAt(timelineEvents.Count - 1);
                            timelineEvents.Add(KeyValuePair.Create(sessionEvent, new TimelineEventDto
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

                timelineEvents.Add(KeyValuePair.Create(sessionEvent, new TimelineEventDto
                {
                    EventType = sessionEvent.EventType,
                    SerializedPayload = sessionEvent.SerializedPayload,
                    HappenedAt = sessionEvent.HappenedAt
                }));
            }

            return timelineEvents.Select(kvp => kvp.Value).Select((e, index) =>
            {
                e.Order = index;
                return e;
            });
        }
    }
}
