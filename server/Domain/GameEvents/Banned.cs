using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using server.Domain.Exceptions;

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
            var gameStartPayload = GameStarted.GetPayload(gameStartEvent);
            var previousBanEvents = session.Events.Where(e => e.EventType == nameof(Banned));

            AssurePlayerCanBan(gameEvent, previousBanEvents, gameStartPayload.Options);

            if (previousBanEvents.Count() + 1 == (gameStartPayload.Options.PlayerCount * gameStartPayload.Options.BanRounds))
            {
                var pickRounds = gameStartPayload.Options.TablePick ? 2 : 1;
                eventsToAdd.Add(GameEvent.GenerateOrderEvent(gameEvent.SessionId, gameStartPayload, pickRounds, _timeProvider.Now, addForSpeaker: true));
            }

            session.Events.AddRange(eventsToAdd);
            _repository.UpdateSession(session);

            await _repository.SaveChangesAsync();
        }

        private void AssurePlayerCanBan(GameEvent gameEvent, IEnumerable<GameEvent> previousBanEvents, DraftOptions options)
        {
            if (options.Bans != true)
            {
                throw new BansNotAllowedException();
            }

            if (previousBanEvents.Count() == 0)
            {
                return;
            }

            var bannedEventPayload = GetPayload(gameEvent);
            var previousSamePlayerBans = previousBanEvents.Select(pbe => GetPayload(pbe)).Where(pbe => pbe.PlayerName == bannedEventPayload.PlayerName);

            if (previousSamePlayerBans.Count() >= options.BanRounds)
            {
                throw new AlreadyDoneException();
            }
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
