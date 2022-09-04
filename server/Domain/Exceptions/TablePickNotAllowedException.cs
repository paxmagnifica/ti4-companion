using System;

namespace server.Domain.Exceptions
{
    [Serializable]
    public class TablePickNotAllowedException : Ti4CompanionDomainException
    {
        public TablePickNotAllowedException() : base("Table pick not enabled")
        {
        }
    }
}
