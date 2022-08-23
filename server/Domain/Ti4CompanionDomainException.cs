using System;

namespace server.Domain
{
    [Serializable]
    public class Ti4CompanionDomainException : Exception
    {
        public Ti4CompanionDomainException(string message) : base(message)
        {
        }
    }
}
