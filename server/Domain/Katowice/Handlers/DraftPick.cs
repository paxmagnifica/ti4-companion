using Newtonsoft.Json;
using Server.Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Domain.Katowice
{
    public class DraftPick : IHandler
    {
        private readonly IRepository repository;

        public DraftPick(IRepository repository)
        {
            this.repository = repository;
        }

        public async Task Handle(GameEvent gameEvent)
        {
            var session = await this.repository.GetByIdWithEvents(gameEvent.SessionId);

            if (session.Events == null)
            {
                // error
            }

            var gameStartEvent = session.GetGameStartedInfo();
            var draftPickPlayerIndexes = new List<int>();
            draftPickPlayerIndexes.AddRange(gameStartEvent.RandomPlayerOrder);
            draftPickPlayerIndexes.AddRange(gameStartEvent.RandomPlayerOrder.Reverse());
            draftPickPlayerIndexes.AddRange(gameStartEvent.RandomPlayerOrder);

            var draftPickAlreadyDone = session.Events.Count(ge => ge.EventType == nameof(DraftPick)) == gameStartEvent.RandomPlayerOrder.Length * 3;

            if (draftPickAlreadyDone)
            {
                throw new ConflictException("draft_already_done");
            }

            var draftPickEventPayloads = session.Events.Where(ev => ev.EventType == nameof(DraftPick)).OrderBy(ev => ev.HappenedAt);
            var draftPickEventsWithPlayerIndexes = draftPickEventPayloads.Select((dpe, index) => Tuple.Create(draftPickPlayerIndexes.ElementAt(index), dpe));
            var currentPlayerIndex = draftPickPlayerIndexes.ElementAt(draftPickEventsWithPlayerIndexes.Count());

            var previousPlayerPickPayloads = draftPickEventsWithPlayerIndexes.Where(dpei => dpei.Item1 == currentPlayerIndex).Select(dpei => GetPayload(dpei.Item2));

            var currentPayload = GetPayload(gameEvent);
            var playerDuplicatingAction = previousPlayerPickPayloads.Any(pppp => pppp.Action == currentPayload.Action);

            if (playerDuplicatingAction)
            {
                throw new ConflictException("draft_duplicating_action");
            }

            if (currentPayload.Action == Constants.FactionAction)
            {
                this.ValidateFactionPick(session.Events, currentPayload);
            }

            if (currentPayload.Action == Constants.InitiativeAction)
            {
                this.ValidateInitiativeAction(session.Events, currentPayload);
            }

            if (currentPayload.Action == Constants.TablePositionAction)
            {
                this.ValidateTablePositionAction(session.Events, currentPayload);
            }

            session.Events.Add(gameEvent);

            if (session.Events.Count(ge => ge.EventType == nameof(DraftPick)) == gameStartEvent.RandomPlayerOrder.Length * 3)
            {
                var draftPickPayloads = session.Events.Where(ge => ge.EventType == nameof(DraftPick)).Select(ge => DraftPick.GetPayload(ge));
                var commitDraftEvent = new GameEvent
                {
                    EventType = nameof(CommitDraft),
                    HappenedAt = gameEvent.HappenedAt.AddMilliseconds(1),
                    SerializedPayload = JsonConvert.SerializeObject(new CommitDraftPayload
                    {
                        Factions = draftPickPayloads.Where(faction => faction.Action == Constants.FactionAction).OrderBy(faction => faction.PlayerIndex).Select(faction => faction.Choice).ToArray(),
                        Initiative = draftPickPayloads.Where(init => init.Action == Constants.InitiativeAction).OrderBy(init => init.PlayerIndex).Select(init => int.Parse(init.Choice)).ToArray(),
                        TablePositions = draftPickPayloads.Where(table => table.Action == Constants.TablePositionAction).OrderBy(table => table.PlayerIndex).Select(table => int.Parse(table.Choice)).ToArray(),
                    }),
                };

                session.Events.Add(commitDraftEvent);
            }

            this.repository.UpdateSession(session);

            await this.repository.SaveChangesAsync();
        }

        internal static DraftPickPayload GetPayload(GameEvent gameEvent)
        {
            return GetPayload(gameEvent.SerializedPayload);
        }

        internal static DraftPickPayload GetPayload(string serializedPayload)
        {
            return JsonConvert.DeserializeObject<DraftPickPayload>(serializedPayload);
        }

        private void ValidateFactionPick(List<GameEvent> events, DraftPickPayload currentPayload)
        {
            var factionsPickedIntoPool = events.Where(ev => ev.EventType == nameof(PickBan) && PickBan.GetPayload(ev).Action == Constants.PickAction).Select(PickBan.GetPayload).Select(p => p.Faction);
            var factionsConfirmedIntoPool = events.Where(ev => ev.EventType == nameof(Nomination) && Nomination.GetPayload(ev).Action == Constants.ConfirmAction).Select(Nomination.GetPayload).Select(p => p.Faction);

            var pickedFactions = events.Where(ev => ev.EventType == nameof(DraftPick) && GetPayload(ev).Action == Constants.FactionAction).Select(DraftPick.GetPayload).Select(p => p.Choice);
            var factionAlreadyPicked = pickedFactions.Contains(currentPayload.Choice);

            if (factionAlreadyPicked)
            {
                throw new ConflictException("faction_already_picked");
            }

            var pickedAvailableFaction = factionsPickedIntoPool.Contains(currentPayload.Choice) || factionsConfirmedIntoPool.Contains(currentPayload.Choice);

            if (!pickedAvailableFaction)
            {
                throw new ConflictException("faction_not_available");
            }
        }

        private void ValidateInitiativeAction(List<GameEvent> events, DraftPickPayload currentPayload)
        {
            var takenInitiative = events.Where(ev => ev.EventType == nameof(DraftPick) && GetPayload(ev).Action == Constants.InitiativeAction).Select(DraftPick.GetPayload).Select(p => p.Choice);

            var validChoice = !takenInitiative.Contains(currentPayload.Choice);

            if (!validChoice)
            {
                throw new ConflictException("initiative_already_picked");
            }
        }

        private void ValidateTablePositionAction(List<GameEvent> events, DraftPickPayload currentPayload)
        {
            var takenTablePositions = events.Where(ev => ev.EventType == nameof(DraftPick) && GetPayload(ev).Action == Constants.TablePositionAction).Select(DraftPick.GetPayload).Select(p => p.Choice);

            var validChoice = !takenTablePositions.Contains(currentPayload.Choice);

            if (!validChoice)
            {
                throw new ConflictException("table_position_already_picked");
            }
        }
    }
}
