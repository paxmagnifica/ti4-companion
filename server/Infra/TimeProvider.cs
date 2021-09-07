using System;

namespace server.Infra
{
    public class TimeProvider: ITimeProvider
    {
        public DateTimeOffset Now { get => DateTimeOffset.Now; }
    }
}
