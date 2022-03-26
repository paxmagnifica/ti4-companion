using System.Collections.Generic;
using System.Linq;
using System;
using server.Domain;
using Newtonsoft.Json;

namespace server.Persistence
{
    public static class DbInitializer
    {
        public static void Initialize(SessionContext context)
        {
            if (!context.Objectives.Any())
            {
                var objectives = new Objective[]
                {
                    new Objective("corner-the-market", GameVersion.Base, 1, false, GamePhase.Status),
                    new Objective("develop-weaponry", GameVersion.Base, 1, false, GamePhase.Status),
                    new Objective("diversify-research", GameVersion.Base, 1, false, GamePhase.Status),
                    new Objective("erect-a-monument", GameVersion.Base, 1, false, GamePhase.Status),
                    new Objective("expand-borders", GameVersion.Base, 1, false, GamePhase.Status),
                    new Objective("found-research-outposts", GameVersion.Base, 1, false, GamePhase.Status),
                    new Objective("intimidate-council", GameVersion.Base, 1, false, GamePhase.Status),
                    new Objective("lead-from-the-front", GameVersion.Base, 1, false, GamePhase.Status),
                    new Objective("negotiate-trade-routes", GameVersion.Base, 1, false, GamePhase.Status),
                    new Objective("sway-the-council", GameVersion.Base, 1, false, GamePhase.Status),
                    new Objective("amass-wealth", GameVersion.PoK, 1, false, GamePhase.Status),
                    new Objective("build-defenses", GameVersion.PoK, 1, false, GamePhase.Status),
                    new Objective("discover-lost-outposts", GameVersion.PoK, 1, false, GamePhase.Status),
                    new Objective("engineer-a-marvel", GameVersion.PoK, 1, false, GamePhase.Status),
                    new Objective("explore-deep-space", GameVersion.PoK, 1, false, GamePhase.Status),
                    new Objective("improve-infrastructure", GameVersion.PoK, 1, false, GamePhase.Status),
                    new Objective("make-history", GameVersion.PoK, 1, false, GamePhase.Status),
                    new Objective("populate-the-outer-rim", GameVersion.PoK, 1, false, GamePhase.Status),
                    new Objective("push-boundaries", GameVersion.PoK, 1, false, GamePhase.Status),
                    new Objective("raise-a-fleet", GameVersion.PoK, 1, false, GamePhase.Status),
                    new Objective("centralize-galactic-trade", GameVersion.Base, 2, false, GamePhase.Status),
                    new Objective("conquer-the-weak", GameVersion.Base, 2, false, GamePhase.Status),
                    new Objective("form-galactic-brain-trust", GameVersion.Base, 2, false, GamePhase.Status),
                    new Objective("found-a-golden-age", GameVersion.Base, 2, false, GamePhase.Status),
                    new Objective("galvanize-the-people", GameVersion.Base, 2, false, GamePhase.Status),
                    new Objective("manipulate-galactic-law", GameVersion.Base, 2, false, GamePhase.Status),
                    new Objective("master-the-sciences", GameVersion.Base, 2, false, GamePhase.Status),
                    new Objective("revolutionize-warfare", GameVersion.Base, 2, false, GamePhase.Status),
                    new Objective("subdue-the-galaxy", GameVersion.Base, 2, false, GamePhase.Status),
                    new Objective("unify-the-colonies", GameVersion.Base, 2, false, GamePhase.Status),
                    new Objective("achieve-supremacy", GameVersion.PoK, 2, false, GamePhase.Status),
                    new Objective("become-a-legend", GameVersion.PoK, 2, false, GamePhase.Status),
                    new Objective("command-an-armada", GameVersion.PoK, 2, false, GamePhase.Status),
                    new Objective("construct-massive-cities", GameVersion.PoK, 2, false, GamePhase.Status),
                    new Objective("control-the-borderlands", GameVersion.PoK, 2, false, GamePhase.Status),
                    new Objective("hold-vast-reserves", GameVersion.PoK, 2, false, GamePhase.Status),
                    new Objective("patrol-vast-territories", GameVersion.PoK, 2, false, GamePhase.Status),
                    new Objective("protect-the-border", GameVersion.PoK, 2, false, GamePhase.Status),
                    new Objective("reclaim-ancient-monuments", GameVersion.PoK, 2, false, GamePhase.Status),
                    new Objective("rule-distant-lands", GameVersion.PoK, 2, false, GamePhase.Status),
                    new Objective("destroy-their-greatest-ship", GameVersion.Base, 1, true, GamePhase.Action),
                    new Objective("make-an-example-of-their-world", GameVersion.Base, 1, true, GamePhase.Action),
                    new Objective("spark-a-rebellion", GameVersion.Base, 1, true, GamePhase.Action),
                    new Objective("turn-their-fleets-to-dust", GameVersion.Base, 1, true, GamePhase.Action),
                    new Objective("unveil-flagship", GameVersion.Base, 1, true, GamePhase.Action),
                    new Objective("become-a-martyr", GameVersion.PoK, 1, true, GamePhase.Action),
                    new Objective("betray-a-friend", GameVersion.PoK, 1, true, GamePhase.Action),
                    new Objective("brave-the-void", GameVersion.PoK, 1, true, GamePhase.Action),
                    new Objective("darken-the-skies", GameVersion.PoK, 1, true, GamePhase.Action),
                    new Objective("demonstrate-your-power", GameVersion.PoK, 1, true, GamePhase.Action),
                    new Objective("fight-with-precision", GameVersion.PoK, 1, true, GamePhase.Action),
                    new Objective("prove-endurance", GameVersion.PoK, 1, true, GamePhase.Action),
                    new Objective("adapt-new-strategies", GameVersion.Base, 1, true, GamePhase.Status),
                    new Objective("become-the-gatekeeper", GameVersion.Base, 1, true, GamePhase.Status),
                    new Objective("control-the-region", GameVersion.Base, 1, true, GamePhase.Status),
                    new Objective("cut-supply-lines", GameVersion.Base, 1, true, GamePhase.Status),
                    new Objective("establish-a-perimeter", GameVersion.Base, 1, true, GamePhase.Status),
                    new Objective("forge-an-alliance", GameVersion.Base, 1, true, GamePhase.Status),
                    new Objective("form-a-spy-network", GameVersion.Base, 1, true, GamePhase.Status),
                    new Objective("fuel-the-war-machine", GameVersion.Base, 1, true, GamePhase.Status),
                    new Objective("gather-a-mighty-fleet", GameVersion.Base, 1, true, GamePhase.Status),
                    new Objective("learn-the-secrets-of-the-cosmos", GameVersion.Base, 1, true, GamePhase.Status),
                    new Objective("master-the-laws-of-physics", GameVersion.Base, 1, true, GamePhase.Status),
                    new Objective("mine-rare-metals", GameVersion.Base, 1, true, GamePhase.Status),
                    new Objective("monopolize-production", GameVersion.Base, 1, true, GamePhase.Status),
                    new Objective("occupy-the-seat-of-the-empire", GameVersion.Base, 1, true, GamePhase.Status),
                    new Objective("threaten-enemies", GameVersion.Base, 1, true, GamePhase.Status),
                    new Objective("defy-space-and-time", GameVersion.PoK, 1, true, GamePhase.Status),
                    new Objective("destroy-heretical-works", GameVersion.PoK, 1, true, GamePhase.Status),
                    new Objective("establish-hegemony", GameVersion.PoK, 1, true, GamePhase.Status),
                    new Objective("foster-cohesion", GameVersion.PoK, 1, true, GamePhase.Status),
                    new Objective("hoard-raw-materials", GameVersion.PoK, 1, true, GamePhase.Status),
                    new Objective("mechanize-the-military", GameVersion.PoK, 1, true, GamePhase.Status),
                    new Objective("occupy-the-fringe", GameVersion.PoK, 1, true, GamePhase.Status),
                    new Objective("produce-en-masse", GameVersion.PoK, 1, true, GamePhase.Status),
                    new Objective("seize-an-icon", GameVersion.PoK, 1, true, GamePhase.Status),
                    new Objective("stake-your-claim", GameVersion.PoK, 1, true, GamePhase.Status),
                    new Objective("strengthen-bonds", GameVersion.PoK, 1, true, GamePhase.Status),
                    new Objective("dictate-policy", GameVersion.PoK, 1, true, GamePhase.Agenda),
                    new Objective("drive-the-debate", GameVersion.PoK, 1, true, GamePhase.Agenda),
                };
                context.Objectives.AddRange(objectives);
            }

            if (!context.Explorations.Any())
            {
                var explorations = new Exploration[] {
                    new Exploration("demilitarized-zone", GameVersion.PoK_Codex2, PlanetType.Cultural, 1, 0, 0),
                    new Exploration("dyson-sphere", GameVersion.PoK_Codex2, PlanetType.Cultural, 1, 1, 2),
                    new Exploration("freelancers", GameVersion.PoK_Codex2, PlanetType.Cultural, 3, 0, 0),
                    new Exploration("gamma-wormhole", GameVersion.PoK_Codex2, PlanetType.Cultural, 1, 0, 0),
                    new Exploration("mercenary-outfit", GameVersion.PoK_Codex2, PlanetType.Cultural, 3, 0, 0),
                    new Exploration("paradise-world", GameVersion.PoK_Codex2, PlanetType.Cultural, 1, 2, 0),
                    new Exploration("tomb-of-emphidia", GameVersion.PoK_Codex2, PlanetType.Cultural, 1, 1, 0),
                    new Exploration("cultural-relic-fragment", GameVersion.PoK_Codex2, PlanetType.Cultural, 9, 0, 0),
                    new Exploration("abandoned-warehouses", GameVersion.PoK_Codex2, PlanetType.Industrial, 4, 0, 0),
                    new Exploration("biotic-research-facility", GameVersion.PoK_Codex2, PlanetType.Industrial, 1, 1, 1, Technology.Biotic),
                    new Exploration("cybernetic-research-facility", GameVersion.PoK_Codex2, PlanetType.Industrial, 1, 1, 1, Technology.Cybernetic),
                    new Exploration("functioning-base", GameVersion.PoK_Codex2, PlanetType.Industrial, 4, 0, 0),
                    new Exploration("local-fabricators", GameVersion.PoK_Codex2, PlanetType.Industrial, 4, 0, 0),
                    new Exploration("propulsion-research-facility", GameVersion.PoK_Codex2, PlanetType.Industrial, 1, 1, 1, Technology.Propulsion),
                    new Exploration("industrial-relic-fragment", GameVersion.PoK_Codex2, PlanetType.Industrial, 5, 0, 0),
                    new Exploration("core-mine", GameVersion.PoK_Codex2, PlanetType.Hazardous, 3, 0, 0),
                    new Exploration("expedition", GameVersion.PoK_Codex2, PlanetType.Hazardous, 3, 0, 0),
                    new Exploration("lazax-survivors", GameVersion.PoK_Codex2, PlanetType.Hazardous, 1, 2, 1),
                    new Exploration("mining-world", GameVersion.PoK_Codex2, PlanetType.Hazardous, 1, 0, 2),
                    new Exploration("rich-world", GameVersion.PoK_Codex2, PlanetType.Hazardous, 1, 0, 1),
                    new Exploration("volatile-fuel-source", GameVersion.PoK_Codex2, PlanetType.Hazardous, 3, 0, 0),
                    new Exploration("warfare-research-facility", GameVersion.PoK_Codex2, PlanetType.Hazardous, 1, 1, 1, Technology.Warfare),
                    new Exploration("hazardous-relic-fragment", GameVersion.PoK_Codex2, PlanetType.Hazardous, 7, 0, 0),
                    new Exploration("derelict-vessel", GameVersion.PoK_Codex2, PlanetType.Frontier, 2, 0, 0),
                    new Exploration("enigmatic-device", GameVersion.PoK_Codex2, PlanetType.Frontier, 2, 0, 0),
                    new Exploration("gamma-relay", GameVersion.PoK_Codex2, PlanetType.Frontier, 1, 0, 0),
                    new Exploration("ion-storm", GameVersion.PoK_Codex2, PlanetType.Frontier, 1, 0, 0),
                    new Exploration("lost-crew", GameVersion.PoK_Codex2, PlanetType.Frontier, 2, 0, 0),
                    new Exploration("merchant-station", GameVersion.PoK_Codex2, PlanetType.Frontier, 2, 0, 0),
                    new Exploration("mirage", GameVersion.PoK_Codex2, PlanetType.Frontier, 1, 0, 0),
                    new Exploration("unknown-relic-fragment", GameVersion.PoK_Codex2, PlanetType.Frontier, 3, 0, 0),
                };
                context.Explorations.AddRange(explorations);
            }

            if (!context.Relics.Any())
            {
                var relics = new Relic[] {
                    new Relic("dominus-orb", GameVersion.PoK),
                    new Relic("maw-of-worlds", GameVersion.PoK),
                    new Relic("scepter-of-emelpar", GameVersion.PoK),
                    new Relic("shard-of-the-throne", GameVersion.PoK),
                    new Relic("stellar-converter", GameVersion.PoK),
                    new Relic("the-codex", GameVersion.PoK),
                    new Relic("the-crown-of-emphidia", GameVersion.PoK),
                    new Relic("the-crown-of-thalnos", GameVersion.PoK),
                    new Relic("the-obsidian", GameVersion.PoK),
                    new Relic("the-prophets-tears", GameVersion.PoK),
                    new Relic("dynamis-core", GameVersion.PoK_Codex2),
                    new Relic("jr-xs455-o", GameVersion.PoK_Codex2),
                    new Relic("nano-forge", GameVersion.PoK_Codex2),
                };
                context.Relics.AddRange(relics);
            }

            if (!context.Sessions.Any())
            {
                var sessionList = new SessionList {
                    Id = "TESTID",
                    CreatedAt = DateTimeOffset.UtcNow,
                    Sessions = new List<Session>(),
                };

                var sessionId = Guid.Parse("6fd5c725-30cd-4320-8889-c2f6427ba365");
                sessionList.Sessions.Add(new Session()
                {
                    Id = sessionId,
                    HashedPassword = "$2a$06$qJPpl6cRPMYqZo0HGAewo.RkKYRunRSS7SgAqpCV2edoUAlA1AqEK", // 'test'
                    Events = new List<GameEvent>() {
                        new GameEvent {
                            Id = Guid.NewGuid(),
                            SessionId = sessionId,
                            HappenedAt = DateTimeOffset.Now,
                            EventType = GameEvent.GameStarted,
                            SerializedPayload = JsonConvert.SerializeObject(new List<string>() { "The_Embers_of_Muaat", "The_Naalu_Collective", "The_Universities_of_Jol__Nar", "The_Nomad" })
                        },
                        new GameEvent {
                            Id = Guid.NewGuid(),
                            SessionId = sessionId,
                            HappenedAt = DateTimeOffset.Now,
                            EventType = nameof(MetadataUpdated),
                            SerializedPayload = JsonConvert.SerializeObject(new MetadataUpdatedPayload {
                              SessionDisplayName = "4 man game",
                              IsTTS = false,
                              IsSplit = false,
                              SessionStart = "2021-09-25",
                              VpCount= 10,
                              Duration = 9
                            })
                        }
                    },
                    CreatedAt = DateTimeOffset.Now,
                });

                var sessionId2 = Guid.Parse("1811a152-b64c-41cd-bdfd-8885fdfb7620");
                sessionList.Sessions.Add(new Session()
                {
                    Id = sessionId2,
                    HashedPassword = "$2a$06$qJPpl6cRPMYqZo0HGAewo.RkKYRunRSS7SgAqpCV2edoUAlA1AqEK", // 'test'
                    Events = new List<GameEvent>() {
                        new GameEvent {
                            Id = Guid.NewGuid(),
                            SessionId = sessionId2,
                            HappenedAt = DateTimeOffset.Now,
                            EventType = GameEvent.GameStarted,
                            SerializedPayload = JsonConvert.SerializeObject(new List<string>() { "The_Titans_of_Ul", "The_Clan_of_Saar", "The_Emirates_of_Hacan", "The_Naaz__Rokha_Alliance", "The_Embers_of_Muaat", "The_Naalu_Collective", "The_Universities_of_Jol__Nar", "The_Nomad" })
                        },
                        new GameEvent {
                            Id = Guid.NewGuid(),
                            SessionId = sessionId2,
                            HappenedAt = DateTimeOffset.Now,
                            EventType = nameof(MetadataUpdated),
                            SerializedPayload = JsonConvert.SerializeObject(new MetadataUpdatedPayload {
                              SessionDisplayName = "8 man game",
                              IsTTS = false,
                              IsSplit = false,
                              SessionStart = "2021-09-26",
                              VpCount= 10,
                              Duration = 9
                            })
                        }
                    },
                    CreatedAt = DateTimeOffset.Now,
                });

                context.SessionLists.Add(sessionList);
            }

            context.SaveChanges();
        }
    }
}
