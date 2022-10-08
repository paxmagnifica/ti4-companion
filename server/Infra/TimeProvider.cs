using server.Domain;
using System;

namespace Server.Infra
{
    public class TimeProvider : ITimeProvider
    {
        public DateTimeOffset Now { get => DateTimeOffset.Now; }
    }
}
