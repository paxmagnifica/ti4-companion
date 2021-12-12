using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace server.Domain
{
    public class Banned : IHandler
    {
        private readonly IRepository _repository;
        private readonly ITimeProvider _timeProvider;

        public Banned(IRepository repository, ITimeProvider timeProvider)
        {
            _repository = repository;
            this._timeProvider = timeProvider;
        }

        public async Task Handle(GameEvent gameEvent)
        {
            var eventsToAdd = new List<GameEvent>() { gameEvent };
            var session = await _repository.GetByIdWithEvents(gameEvent.SessionId);

            if (session.Events == null)
            {
                session.Events = new List<GameEvent>();
            }

            var gameStartEvent = session.Events.FirstOrDefault(e => e.EventType == nameof(GameStarted));
            var payload = GameStarted.GetPayload(gameStartEvent);
            var previousBanEvents = session.Events.Where(e => e.EventType == nameof(Banned));

            if (previousBanEvents.Count() + 1 == payload.Options.AllBansCount)
            {
                var pickRounds = 1;
                eventsToAdd.Add(GameEvent.GenerateOrderEvent(gameEvent.SessionId, payload, pickRounds, _timeProvider.Now));
            }

            session.Events.AddRange(eventsToAdd);
            _repository.UpdateSession(session);

            await _repository.SaveChangesAsync();
        }

        internal static BannedPayload GetPayload(GameEvent gameEvent)
        {
            return JsonConvert.DeserializeObject<BannedPayload>(gameEvent.SerializedPayload);
        }
    }

    public class BannedPayload
    {
        public string[] Bans { get; set; }
        public int PlayerIndex { get; set; }
        public string PlayerName { get; set; }
    }
}
