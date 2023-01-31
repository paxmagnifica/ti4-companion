using Newtonsoft.Json;
using Server.Domain.Exceptions;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Domain
{
    public class Banned : IHandler
    {
        private readonly IRepository repository;
        private readonly ITimeProvider timeProvider;

        public Banned(IRepository repository, ITimeProvider timeProvider)
        {
            this.repository = repository;
            this.timeProvider = timeProvider;
        }

        public async Task Handle(GameEvent gameEvent)
        {
            var eventsToAdd = new List<GameEvent>() { gameEvent };
            var session = await this.repository.GetByIdWithEvents(gameEvent.SessionId);

            if (session.Events == null)
            {
                session.Events = new List<GameEvent>();
            }

            var gameStartEvent = session.Events.FirstOrDefault(e => e.EventType == nameof(GameStarted));
            var gameStartPayload = GameStarted.GetPayload(gameStartEvent);
            var previousBanEvents = session.Events.Where(e => e.EventType == nameof(Banned));

            this.AssurePlayerCanBan(gameEvent, previousBanEvents, gameStartPayload.Options);

            if (previousBanEvents.Count() + 1 == (gameStartPayload.Options.PlayerCount * gameStartPayload.Options.BanRounds))
            {
                var pickRounds = gameStartPayload.Options.TablePick ? 2 : 1;
                eventsToAdd.Add(GameEvent.GenerateOrderEvent(gameEvent.SessionId, gameStartPayload, pickRounds, this.timeProvider.Now, addForSpeaker: true));
            }

            session.Events.AddRange(eventsToAdd);
            this.repository.UpdateSession(session);

            await this.repository.SaveChangesAsync();
        }

        internal static BannedPayload GetPayload(GameEvent gameEvent)
        {
            return JsonConvert.DeserializeObject<BannedPayload>(gameEvent.SerializedPayload);
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

            var currentBanRound = System.Math.Round(previousBanEvents.Count() / (double)options.BansPerRound);

            if (previousSamePlayerBans.Count() >= currentBanRound)
            {
                throw new AlreadyDoneException();
            }
        }
    }
}
