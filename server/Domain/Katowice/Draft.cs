using System.Collections.Generic;
using System.Linq;

namespace Server.Domain.Katowice
{
    public class Draft
    {
        public static GameStartedPayload GetPayloadWithRandomOrder(GameStartedPayload payload)
        {
            EnsureKatowiceDraft(payload);

            GameStartedPayload newPayload = new GameStartedPayload(payload);

            var randomizedPlayerOrder = Enumerable.Range(0, payload.Options.Players.Length).ToList();
            randomizedPlayerOrder.Shuffle();
            newPayload.RandomPlayerOrder = randomizedPlayerOrder.ToArray();

            return newPayload;
        }

        private static void EnsureKatowiceDraft(GameStartedPayload payload)
        {
            if (payload.SetupType != Constants.SetupType)
            {
                throw new InvalidGameException();
            }
        }

        public static DraftDto GetDto(Session session)
        {
            var gameStartedEvent = session.Events.FirstOrDefault(ge => ge.EventType == GameEvent.GameStarted);
            var gameStartedPayload = GameStarted.GetPayload(gameStartedEvent.SerializedPayload);

            var builtDto = new DraftDto
            {
                Phase = Constants.PickBanPhase,
                InitialPool = gameStartedPayload.Options.InitialPool,
            };

            var playerIndexesThereAndBackAgain = new List<int>();
            playerIndexesThereAndBackAgain.AddRange(gameStartedPayload.RandomPlayerOrder);
            playerIndexesThereAndBackAgain.AddRange(gameStartedPayload.RandomPlayerOrder.Reverse());

            var pickBanEvents = session.Events.Where(ge => ge.EventType == nameof(PickBan));
            var pickBanOrder = playerIndexesThereAndBackAgain.Select((playerIndex, pickBanIndex) =>
            {
                var choice = pickBanEvents.ElementAtOrDefault(pickBanIndex);
                return new PickBanDto
                {
                    Player = gameStartedPayload.Options.Players[playerIndex],
                    PlayerIndex = playerIndex,
                    Action = pickBanIndex % 2 == 0 ? Constants.BanAction : Constants.PickAction,
                    Choice = choice != null ? PickBan.GetPayload(choice).Faction : null,
                };
            });

            builtDto.PickBans = pickBanOrder.ToArray();

            if (playerIndexesThereAndBackAgain.Count() == pickBanEvents.Count())
            {
                builtDto.Phase = Constants.NominationsPhase;

                var nominations = playerIndexesThereAndBackAgain.Select(playerIndex =>
                {
                    return new NominationDto
                    {
                        Player = gameStartedPayload.Options.Players[playerIndex],
                        PlayerIndex = playerIndex,
                        Action = null,
                        Choice = null,
                    };
                });

                builtDto.Nominations = nominations.ToArray();
            }

            return builtDto;
        }
    }
}
