using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using server.Domain;
using server.Persistence;

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
        private readonly SessionContext _sessionContext;

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
            IEnumerable<TimelineEventDto> timelineEvents = sessionFromDb.Events.OrderBy(e => e.HappenedAt).Select((e, index) =>
            {
                if (e.EventType == nameof(MetadataUpdated))
                {
                    var payload = MetadataUpdated.GetPayload(e);
                    var newPayload = JsonConvert.SerializeObject(new { from = previousVpCount, to = payload.VpCount });
                    previousVpCount = payload.VpCount;
                    return new TimelineEventDto
                    {
                        Order = index,
                        EventType = "VpCountChanged",
                        SerializedPayload = newPayload,
                        HappenedAt = e.HappenedAt
                    };

                }
                return new TimelineEventDto
                {
                    Order = index,
                    EventType = e.EventType,
                    SerializedPayload = e.SerializedPayload,
                    HappenedAt = e.HappenedAt
                };
            });

            return timelineEvents;
        }
    }
}
