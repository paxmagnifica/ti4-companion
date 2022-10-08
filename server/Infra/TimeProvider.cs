using System;
using server.Domain;

namespace server.Infra
{
    public class TimeProvider : ITimeProvider
    {
        public DateTimeOffset Now { get => DateTimeOffset.Now; }
    }
}
