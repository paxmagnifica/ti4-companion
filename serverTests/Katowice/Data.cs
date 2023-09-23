using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Server.Domain;
using KTW = Server.Domain.Katowice;

namespace ServerTests.Katowice
{
    class Data
    {
        public static string[] GetInitialPool()
        {
            return new string[] {
                "The_Arborec",
                "The_Barony_of_Letnev",
                "The_Clan_of_Saar",
                "The_Embers_of_Muaat",
                "The_Emirates_of_Hacan",
                "The_Federation_of_Sol",
                "The_Ghosts_of_Creuss",
                "The_L1Z1X_Mindnet",
                "The_Mentak_Coalition",
                "The_Naalu_Collective",
                "The_Nekro_Virus",
                "Sardakk_Norr",
                "The_Universities_of_Jol__Nar",
                "The_Winnu",
                "The_Xxcha_Kingdom",
                "The_Yin_Brotherhood",
                "The_Yssaril_Tribes",
                "The_Argent_Flight",
                "The_Empyrean",
                "The_Mahact_Gene__Sorcerers",
                "The_Naaz__Rokha_Alliance",
                "The_Nomad",
                "The_Titans_of_Ul",
                "The_VuilRaith_Cabal",
                "The_Council_Keleres",
            };
        }

        public static Tuple<IEnumerable<KTW.NominationDto>, IEnumerable<GameEvent>> GetAllNominations()
        {
            IEnumerable<KTW.NominationDto> resultingDto = new List<KTW.NominationDto> {
                new KTW.NominationDto{ Player = "Player 2", PlayerIndex = 2, Action = "nominate", Choice = "The_Federation_of_Sol" },
                new KTW.NominationDto{ Player = "Player 5", PlayerIndex = 5, Action = "nominate", Choice = "The_Ghosts_of_Creuss" },
                new KTW.NominationDto{ Player = "Player 3", PlayerIndex = 3, Action = "nominate", Choice = "The_Mentak_Coalition" },
                new KTW.NominationDto{ Player = "Player 1", PlayerIndex = 1, Action = "nominate", Choice = "Sardakk_Norr" },
                new KTW.NominationDto{ Player = "Player 0", PlayerIndex = 0, Action = "nominate", Choice = "The_Winnu" },
                new KTW.NominationDto{ Player = "Player 4", PlayerIndex = 4, Action = "nominate", Choice = "The_Yssaril_Tribes" },
                new KTW.NominationDto{ Player = "Player 4", PlayerIndex = 4, Action = "nominate", Choice = "The_Empyrean" },
                new KTW.NominationDto{ Player = "Player 0", PlayerIndex = 0, Action = "nominate", Choice = "The_Mahact_Gene__Sorcerers" },
                new KTW.NominationDto{ Player = "Player 1", PlayerIndex = 1, Action = "confirm", Choice = "The_Ghosts_of_Creuss" },
                new KTW.NominationDto{ Player = "Player 3", PlayerIndex = 3, Action = "confirm", Choice = "The_Yssaril_Tribes" },
                new KTW.NominationDto{ Player = "Player 5", PlayerIndex = 5, Action = "nominate", Choice = "The_Naaz__Rokha_Alliance" },
                new KTW.NominationDto{ Player = "Player 2", PlayerIndex = 2, Action = "confirm", Choice = "The_Empyrean" },
            };

            var gameEvents = resultingDto.Select(dto => new GameEvent
            {
                EventType = nameof(KTW.Nomination),
                SerializedPayload = JsonConvert.SerializeObject(new KTW.NominationPayload
                {
                    PlayerIndex = dto.PlayerIndex,
                    Action = dto.Action,
                    Faction = dto.Choice,
                }),
            });

            return Tuple.Create(resultingDto, gameEvents);
        }

        public static Tuple<IEnumerable<KTW.PickBanDto>, IEnumerable<GameEvent>> GetAllPickBans()
        {
            IEnumerable<KTW.PickBanDto> resultingDto = new List<KTW.PickBanDto> {
                new KTW.PickBanDto{ Player = "Player 2", PlayerIndex = 2, Action = "ban", Choice = "The_Naalu_Collective" },
                new KTW.PickBanDto{ Player = "Player 5", PlayerIndex = 5, Action = "pick", Choice = "The_Arborec" },
                new KTW.PickBanDto{ Player = "Player 3", PlayerIndex = 3, Action = "ban", Choice = "The_Universities_of_Jol__Nar" },
                new KTW.PickBanDto{ Player = "Player 1", PlayerIndex = 1, Action = "pick", Choice = "The_Barony_of_Letnev" },
                new KTW.PickBanDto{ Player = "Player 0", PlayerIndex = 0, Action = "ban", Choice = "The_Clan_of_Saar" },
                new KTW.PickBanDto{ Player = "Player 4", PlayerIndex = 4, Action = "pick", Choice = "The_Embers_of_Muaat" },
                new KTW.PickBanDto{ Player = "Player 4", PlayerIndex = 4, Action = "ban", Choice = "The_Emirates_of_Hacan" },
                new KTW.PickBanDto{ Player = "Player 0", PlayerIndex = 0, Action = "pick", Choice = "The_L1Z1X_Mindnet" },
                new KTW.PickBanDto{ Player = "Player 1", PlayerIndex = 1, Action = "ban", Choice = "The_Nekro_Virus" },
                new KTW.PickBanDto{ Player = "Player 3", PlayerIndex = 3, Action = "pick", Choice = "The_Yin_Brotherhood" },
                new KTW.PickBanDto{ Player = "Player 5", PlayerIndex = 5, Action = "ban", Choice = "The_Xxcha_Kingdom" },
                new KTW.PickBanDto{ Player = "Player 2", PlayerIndex = 2, Action = "pick", Choice = "The_Argent_Flight" },
            };

            var gameEvents = resultingDto.Select(dto => new GameEvent
            {
                EventType = nameof(KTW.PickBan),
                SerializedPayload = JsonConvert.SerializeObject(new KTW.PickBanPayload
                {
                    PlayerIndex = dto.PlayerIndex,
                    Action = dto.Action,
                    Faction = dto.Choice,
                }),
            });

            return Tuple.Create(resultingDto, gameEvents);
        }

        public static Tuple<IEnumerable<KTW.ActualDraftDto>, IEnumerable<GameEvent>> GetFullDraft()
        {
            IEnumerable<KTW.ActualDraftDto> resultingDto = new List<KTW.ActualDraftDto> {
                new KTW.ActualDraftDto{ Player = "Player 2", PlayerIndex = 2, Action = "initiative", Choice = "1" },
                new KTW.ActualDraftDto{ Player = "Player 5", PlayerIndex = 5, Action = "initiative", Choice = "2" },
                new KTW.ActualDraftDto{ Player = "Player 3", PlayerIndex = 3, Action = "tablePosition", Choice = "0" },
                new KTW.ActualDraftDto{ Player = "Player 1", PlayerIndex = 1, Action = "faction", Choice = "The_Arborec" },
                new KTW.ActualDraftDto{ Player = "Player 0", PlayerIndex = 0, Action = "faction", Choice = "The_Barony_of_Letnev" },
                new KTW.ActualDraftDto{ Player = "Player 4", PlayerIndex = 4, Action = "tablePosition", Choice = "3" },
                new KTW.ActualDraftDto{ Player = "Player 4", PlayerIndex = 4, Action = "initiative", Choice = "3" },
                new KTW.ActualDraftDto{ Player = "Player 0", PlayerIndex = 0, Action = "tablePosition", Choice = "2" },
                new KTW.ActualDraftDto{ Player = "Player 1", PlayerIndex = 1, Action = "initiative", Choice = "4" },
                new KTW.ActualDraftDto{ Player = "Player 3", PlayerIndex = 3, Action = "faction", Choice = "The_Yin_Brotherhood" },
                new KTW.ActualDraftDto{ Player = "Player 5", PlayerIndex = 5, Action = "faction", Choice = "The_L1Z1X_Mindnet" },
                new KTW.ActualDraftDto{ Player = "Player 2", PlayerIndex = 2, Action = "faction", Choice = "The_Embers_of_Muaat" },
                new KTW.ActualDraftDto{ Player = "Player 2", PlayerIndex = 2, Action = "tablePosition", Choice = "1" },
                new KTW.ActualDraftDto{ Player = "Player 5", PlayerIndex = 5, Action = "tablePosition", Choice = "4" },
                new KTW.ActualDraftDto{ Player = "Player 3", PlayerIndex = 3, Action = "initiative", Choice = "5" },
                new KTW.ActualDraftDto{ Player = "Player 1", PlayerIndex = 1, Action = "tablePosition", Choice = "5" },
                new KTW.ActualDraftDto{ Player = "Player 0", PlayerIndex = 0, Action = "initiative", Choice = "6" },
                new KTW.ActualDraftDto{ Player = "Player 4", PlayerIndex = 4, Action = "faction", Choice = "The_Argent_Flight" },
            };

            var gameEvents = resultingDto.Select(dto => new GameEvent
            {
                EventType = nameof(KTW.DraftPick),
                SerializedPayload = JsonConvert.SerializeObject(new KTW.DraftPickPayload
                {
                    PlayerIndex = dto.PlayerIndex,
                    Action = dto.Action,
                    Choice = dto.Choice,
                }),
            });

            return Tuple.Create(resultingDto, gameEvents);
        }

        public static Session GetFullyDraftedSession()
        {
            var sessionId = Guid.NewGuid();
            var session = new Session()
            {
                Id = sessionId,
                Events = new List<GameEvent>{
                    new GameEvent
                    {
                        EventType = nameof(GameStarted),
                        SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload
                        {
                            SetupType = "katowice_draft",
                            Options = new DraftOptions
                            {
                                InitialPool = Data.GetInitialPool(),
                                Players = new string[] { "Player 0", "Player 1", "Player 2", "Player 3", "Player 4", "Player 5" },
                            },
                            RandomPlayerOrder = new int[] { 2, 5, 3, 1, 0, 4 },
                        }),
                    },
                },
            };

            session.Events.AddRange(GetAllPickBans().Item2);
            session.Events.AddRange(GetAllNominations().Item2);
            session.Events.AddRange(GetFullDraft().Item2);

            return session;
        }

        public static Session GetSessionWithDraftCommitted()
        {
            var sessionId = Guid.NewGuid();
            var session = new Session()
            {
                Id = sessionId,
                Events = new List<GameEvent>{
                    new GameEvent
                    {
                        EventType = nameof(GameStarted),
                        SerializedPayload = JsonConvert.SerializeObject(new GameStartedPayload
                        {
                            SetupType = "katowice_draft",
                            Options = new DraftOptions
                            {
                                InitialPool = Data.GetInitialPool(),
                                Players = new string[] { "Player 0", "Player 1", "Player 2", "Player 3", "Player 4", "Player 5" },
                            },
                            RandomPlayerOrder = new int[] { 2, 5, 3, 1, 0, 4 },
                        }),
                    },
                },
            };

            session.Events.AddRange(GetAllPickBans().Item2);
            session.Events.AddRange(GetAllNominations().Item2);
            session.Events.AddRange(GetFullDraft().Item2);
            session.Events.Add(new GameEvent
            {
                EventType = nameof(CommitDraft),
                SerializedPayload = JsonConvert.SerializeObject(new CommitDraftPayload
                {
                    Factions = new string[] { "The_Barony_of_Letnev", "The_Arborec", "The_Embers_of_Muaat", "The_Yin_Brotherhood", "The_Argent_Flight", "The_L1Z1X_Mindnet" },
                    TablePositions = new int[] { 2, 5, 1, 0, 3, 4 },
                    Initiative = new int[] { 6, 4, 1, 5, 3, 2 },
                }),
            });

            return session;
        }
    }
}
