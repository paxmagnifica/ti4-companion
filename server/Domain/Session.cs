using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Domain
{
    public class Session
    {
        public Guid Id { get; set; }
        public bool Locked { get; set; }
        public string HashedPassword { get; set; }
        [NotMapped]
        public bool Secured { get => !String.IsNullOrEmpty(HashedPassword); }
        public List<GameEvent> Events { get; set; }

        public DateTimeOffset CreatedAt { get; set; }
    }
}
