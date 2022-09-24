using System;

namespace server.Domain.Exceptions
{
    [Serializable]
    public class AlreadyDoneException : Ti4CompanionDomainException
    {
        public AlreadyDoneException() : base("Not allowed, conflict")
        {

        }
    }
}