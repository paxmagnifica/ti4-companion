using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
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

        public EventsController(EventFactory eventFactory, Dispatcher dispatch, ILogger<EventsController> logger)
        {
            _eventFactory = eventFactory;
            _dispatcher = dispatch;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromRoute]Guid sessionId, [FromBody]EventDto eventDto)
        {
            try
            {
                var gameEvent = _eventFactory.GetGameEvent(sessionId, eventDto);
                await _dispatcher.Dispatch(gameEvent);

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
