using System;
using System.ComponentModel.DataAnnotations;

namespace Server.Domain
{
    public class Token
    {
        public Guid SessionId { get; set; }

        [Key]
        public Guid Value { get; set; }

        public DateTimeOffset Expires { get; set; }
    }
}
