using System;

namespace server.Domain.Exceptions
{
    [Serializable]
    public class BansNotAllowedException : Ti4CompanionDomainException
    {
        public BansNotAllowedException () : base("Bans not allowed, conflict")
        {

        }
    }
}
