using System;
using System.Collections.Generic;
using server.Domain;
using System.Linq;

namespace server
{
    public static class DbInitializer
    {
        public static void Initialize(SessionContext context)
        {
            // Look for any students.
            if (context.Sessions.Any())
            {
                return;   // DB has been seeded
            }

            var sessions = new Session[]
            {
                new Session{Id=Guid.NewGuid(),CreatedAt=DateTimeOffset.UtcNow,Factions=new List<string>(){ "The_Arborec", "The_Barony_of_Letnev", "The_Embers_of_Muaat", "The_Clan_of_Saar" }}
            };

            context.Sessions.AddRange(sessions);
            context.SaveChanges();
        }
    }
}
