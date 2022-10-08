using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using server.Infra;

namespace server.Controllers
{
    [ApiController]
    [Route("api/sessions/{sessionId:guid}/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly EventFactory _eventFactory;
        private readonly Dispatcher _dispatcher;
        private readonly ILogger<EventsController> _logger;
        private readonly IHubContext<SessionHub> _sessionHub;

        public EventsController(EventFactory eventFactory, Dispatcher dispatch, ILogger<EventsController> logger, IHubContext<SessionHub> sessionHub)
        {
            _eventFactory = eventFactory;
            _dispatcher = dispatch;
            _logger = logger;
            _sessionHub = sessionHub;
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromRoute] Guid sessionId, [FromBody] EventDto eventDto)
        {
            try
            {
                var gameEvent = _eventFactory.GetGameEvent(sessionId, eventDto);
                await _dispatcher.Dispatch(gameEvent);

                await _sessionHub.Clients.Group(sessionId.ToString()).SendCoreAsync("SessionEvent", new object[] { gameEvent });

                return new OkResult();
            }
            catch (HandlerNotFoundException exception)
            {
                _logger.LogWarning(exception.Message);
                return new NotFoundResult();
            }
        }
    }
}
