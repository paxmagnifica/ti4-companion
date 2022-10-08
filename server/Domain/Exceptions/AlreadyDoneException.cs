//

using System;

namespace Server.Domain.Exceptions
{
    [Serializable]
    public class AlreadyDoneException : Ti4CompanionDomainException
    {
        public AlreadyDoneException()
            : base("Not allowed, conflict")
        {
        }
    }
}
