using System;

namespace Server.Domain
{
    public interface ITimeProvider
    {
        DateTimeOffset Now { get; }
    }
}
