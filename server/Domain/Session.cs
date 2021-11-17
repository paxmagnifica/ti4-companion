using System;
using System.Collections.Generic;

namespace server.Domain
{
    public class Session
    {
        public Guid Id { get; set; }
        public Guid Secret { get; set; }
        public bool Locked { get; set; }
        public List<GameEvent> Events { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        internal bool CanEditWith(Guid secret)
        {
            return secret == Secret;
        }
    }
}
