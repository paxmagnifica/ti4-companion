using Server.Domain;
using System;

namespace ServerTests.Mocks
{
    internal class TimeProvider : ITimeProvider
    {
        public DateTimeOffset Now => throw new NotImplementedException();
    }
}
