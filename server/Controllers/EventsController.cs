using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Server.Infra;
using System;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/sessions/{sessionId:guid}/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly EventFactory eventFactory;
        private readonly Dispatcher dispatcher;
        private readonly ILogger<EventsController> logger;
        private readonly IHubContext<SessionHub> sessionHub;

        public EventsController(EventFactory eventFactory, Dispatcher dispatch, ILogger<EventsController> logger, IHubContext<SessionHub> sessionHub)
        {
            this.eventFactory = eventFactory;
            this.dispatcher = dispatch;
            this.logger = logger;
            this.sessionHub = sessionHub;
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromRoute] Guid sessionId, [FromBody] EventDto eventDto)
        {
            try
            {
                var eventAllowed = await this.eventFactory.CanEventBeAdded(sessionId, eventDto);

                if (!eventAllowed)
                {
                    return new BadRequestObjectResult(new {
                        tiCompanionError = "stale_state_event"
                    });
                }

                var gameEvent = this.eventFactory.GetGameEvent(sessionId, eventDto);
                await this.dispatcher.Dispatch(gameEvent);

                await this.sessionHub.Clients.Group(sessionId.ToString()).SendCoreAsync("SessionEvent", new object[] { gameEvent });

                return new OkResult();
            }
            catch (HandlerNotFoundException exception)
            {
                this.logger.LogWarning(exception.Message);
                return new NotFoundResult();
            }
        }
    }
}
