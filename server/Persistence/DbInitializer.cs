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
            // Look for any students.
            if (context.Objectives.Any())
            {
                return; // DB has been seeded
            }

            var sessionId = Guid.Parse("6fd5c725-30cd-4320-8889-c2f6427ba365");
            context.Sessions.Add(new Session() {
                Id = sessionId,
                Events = new List<GameEvent>() {
                    new GameEvent {
                        Id = Guid.NewGuid(),
                        SessionId = sessionId,
                        HappenedAt = DateTimeOffset.Now,
                        EventType = GameEvent.GameStarted,
                        SerializedPayload = JsonConvert.SerializeObject(new List<string>() { "The_Embers_of_Muaat", "The_Naalu_Collective", "The_Universities_of_Jol__Nar", "The_Nomad" })
                    }
                },
                CreatedAt = DateTimeOffset.Now,
            });

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
            context.SaveChanges();
        }
    }
}
