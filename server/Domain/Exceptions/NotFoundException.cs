using System;

namespace Server.Domain.Exceptions
{
    [Serializable]
    public class NotFoundException : Ti4CompanionDomainException
    {
        public NotFoundException(string entityName)
            : base($"{entityName} not found")
        {
        }
    }
}
