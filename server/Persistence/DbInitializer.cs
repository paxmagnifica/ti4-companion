using System;
using System.Collections.Generic;
using server.Domain;
using System.Linq;
using Newtonsoft.Json;

namespace server.Persistence
{
    public static class DbInitializer
    {
        public static void Initialize(SessionContext context)
        {
            // Look for any students.
            if (context.Sessions.Any())
            {
                return; // DB has been seeded
            }

            var sessionId = Guid.NewGuid();
            var sessions = new Session[]
            {
                new Session{
                    Id = sessionId,
                    CreatedAt = DateTimeOffset.Now,
                    Events = new List<GameEvent>() {
                        new GameEvent
                        {
                            Id = Guid.NewGuid(),
                            SessionId = sessionId,
                            EventType = GameEvent.GameStarted,
                            HappenedAt = DateTimeOffset.Now,
                            SerializedPayload = JsonConvert.SerializeObject(new List<string>(){ "The_Arborec", "The_Barony_of_Letnev", "The_Embers_of_Muaat", "The_Clan_of_Saar" })
                        }
                    }
                }
            };

            context.Sessions.AddRange(sessions);
            context.SaveChanges();
        }
    }
}
