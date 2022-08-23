using System;
using server.Domain;

namespace serverTests.Mocks
{
    class TimeProvider : ITimeProvider
    {
        public DateTimeOffset Now => throw new NotImplementedException();
    }
}
