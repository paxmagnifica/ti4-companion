using System;

namespace Server.Domain.Exceptions
{
    [Serializable]
    public class ConflictException : Ti4CompanionDomainException
    {
        public ConflictException(string key = null)
            : base("Cannot take the action due to conflicting state", key)
        {
        }
    }
}
