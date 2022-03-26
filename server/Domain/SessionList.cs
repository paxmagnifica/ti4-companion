using System;
using System.Collections.Generic;

namespace server.Domain
{
    public class SessionList
    {
        public string Id { get; set; }
        public List<Session> Sessions { get; set; }

        public DateTimeOffset CreatedAt { get; set; }
    }
}
