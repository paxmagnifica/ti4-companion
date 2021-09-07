using System;

namespace server.Infra
{
    public interface ITimeProvider
    {
        DateTimeOffset Now { get; }
    }
}
