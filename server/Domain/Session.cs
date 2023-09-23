using System;
using System.Collections.Generic;
using System.Linq;
using Server.Domain.Exceptions;

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

        public GameStartedPayload GetGameStartedInfo() {
            var e = this.Events.FirstOrDefault(ev => ev.EventType == nameof(GameStarted));
            if (e == null) {
                throw new Ti4CompanionDomainException("game not started yet");
            }

            return GameStarted.GetPayload(e);
        }
    }
}
