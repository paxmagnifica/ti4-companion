using System;
using System.Collections.Generic;

namespace server.Domain
{
    public class Session
    {
        public Guid Id { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public List<string> Factions { get; set; }
        public List<GameEvent> Events { get; set; }
    }
}
