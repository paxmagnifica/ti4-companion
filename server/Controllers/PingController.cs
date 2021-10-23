using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PingController : ControllerBase
    {
        private readonly ILogger<PingController> _logger;

        public PingController(ILogger<PingController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public ActionResult<string> Post()
        {
            _logger.LogInformation("ping");

            return "pong";
        }
    }
}
