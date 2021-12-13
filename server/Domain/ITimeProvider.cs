using System;

namespace server.Domain
{
    public interface ITimeProvider
    {
        DateTimeOffset Now { get; }
    }
}
