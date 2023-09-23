using System;
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

        public static DraftDto GetDto(Session session)
        {
            var gameStartedPayload = session.GetGameStartedInfo();

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

            var nominationEvents = session.Events.Where(ge => ge.EventType == nameof(Nomination));
            if (playerIndexesThereAndBackAgain.Count() == pickBanEvents.Count())
            {
                builtDto.Phase = Constants.NominationsPhase;

                var nominations = playerIndexesThereAndBackAgain.Select((playerIndex, nominationIndex) =>
                {
                    var choice = nominationEvents.ElementAtOrDefault(nominationIndex);
                    var choicePayload = choice != null ? Nomination.GetPayload(choice) : null;
                    return new NominationDto
                    {
                        Player = gameStartedPayload.Options.Players[playerIndex],
                        PlayerIndex = playerIndex,
                        Action = choicePayload?.Action,
                        Choice = choicePayload?.Faction,
                    };
                });

                builtDto.Nominations = nominations.ToArray();
            }

            if (playerIndexesThereAndBackAgain.Count() == nominationEvents.Count())
            {
                builtDto.Phase = Constants.DraftPhase;

                var draftIndexes3Lines = new List<int>();
                draftIndexes3Lines.AddRange(gameStartedPayload.RandomPlayerOrder);
                draftIndexes3Lines.AddRange(gameStartedPayload.RandomPlayerOrder.Reverse());
                draftIndexes3Lines.AddRange(gameStartedPayload.RandomPlayerOrder);

                var draftPickEvents = session.Events.Where(ge => ge.EventType == nameof(DraftPick));
                var draft = draftIndexes3Lines.Select((playerIndex, draftPickIndex) =>
                {
                    var draftPick = draftPickEvents.ElementAtOrDefault(draftPickIndex);
                    var draftPickPayload = draftPick != null ? DraftPick.GetPayload(draftPick) : null;
                    return new ActualDraftDto
                    {
                        Player = gameStartedPayload.Options.Players[playerIndex],
                        PlayerIndex = playerIndex,
                        Action = draftPickPayload?.Action,
                        Choice = draftPickPayload?.Choice,
                    };
                });

                builtDto.Draft = draft.ToArray();
            }

            return builtDto;
        }

        // TODO not cool that this is from controllers
        // we should not depend on that in Domain
        // but let's face it, the whole structure is all over the place anyway
        public static IEnumerable<Controllers.PlayerDto> GeneratePlayerDto(Session session)
        {
            var gameStartedPayload = session.GetGameStartedInfo();

            var draftPickPlayerIndexes = new List<int>();
            draftPickPlayerIndexes.AddRange(gameStartedPayload.RandomPlayerOrder);
            draftPickPlayerIndexes.AddRange(gameStartedPayload.RandomPlayerOrder.Reverse());
            draftPickPlayerIndexes.AddRange(gameStartedPayload.RandomPlayerOrder);

            var draftPickPayloads = session.Events.Where(ge => ge.EventType == nameof(DraftPick)).Select(ge => DraftPick.GetPayload(ge));

            var groupedByPlayerIndex = draftPickPlayerIndexes.Select((playerIndex, payloadIndex) => new
            {
                playerIndex = playerIndex,
                payload = draftPickPayloads.ElementAtOrDefault(payloadIndex),
            }).GroupBy(a => a.playerIndex);

            var isFinished = draftPickPayloads.Count() == draftPickPlayerIndexes.Count;
            var ordered = isFinished ? groupedByPlayerIndex.OrderBy(group => int.Parse(group.First(g => g.payload.Action == Constants.InitiativeAction).payload.Choice)) : groupedByPlayerIndex.OrderBy(group => group.Key);

            return ordered.Select(group =>
            {
                var groupWithoutNulls = group.Where(g => g.payload != null);

                var faction = groupWithoutNulls.FirstOrDefault(g => g.payload.Action == Constants.FactionAction)?.payload.Choice;
                var atTable = int.Parse(groupWithoutNulls.FirstOrDefault(g => g.payload.Action == Constants.TablePositionAction)?.payload.Choice ?? "-1");
                var initiative = int.Parse(groupWithoutNulls.FirstOrDefault(g => g.payload.Action == Constants.InitiativeAction)?.payload.Choice ?? "0");
                var speaker = initiative == 1;

                return new Controllers.PlayerDto
                {
                    PlayerName = gameStartedPayload.Options.Players[group.Key],
                    AtTable = atTable,
                    Faction = faction,
                    Speaker = speaker,
                    Initiative = initiative,
                };
            });
        }

        private static void EnsureKatowiceDraft(GameStartedPayload payload)
        {
            if (payload.SetupType != Constants.SetupType)
            {
                throw new InvalidGameException();
            }
        }

    }
}
