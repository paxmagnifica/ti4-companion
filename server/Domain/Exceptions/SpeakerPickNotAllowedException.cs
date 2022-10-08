using System;

namespace Server.Domain.Exceptions
{
    [Serializable]
    public class SpeakerPickNotAllowedException : Ti4CompanionDomainException
    {
        public SpeakerPickNotAllowedException()
            : base("Speaker pick not enabled")
        {
        }
    }
}
