using System;
using System.Collections.Generic;

namespace Server.Domain
{
    public class Session
    {
        public Session()
        {
            this.Events = new List<GameEvent>();
            this.SessionLists = new List<SessionList>();
        }

        public Guid Id { get; set; }

        public bool Locked { get; set; }

        public string HashedPassword { get; set; }

        public List<GameEvent> Events { get; set; }

        public List<SessionList> SessionLists { get; set; }

        public DateTimeOffset CreatedAt { get; set; }
    }
}
