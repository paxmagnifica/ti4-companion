using System;

namespace Server.Domain.Exceptions
{
    [Serializable]
    public class MetadataUpdatedPayloadInvalidException : Ti4CompanionDomainException
    {
        public MetadataUpdatedPayloadInvalidException(string validationErrorDetails) 
            : base($"Metadata payload invalid: {validationErrorDetails}")
        {
        }
    }
}
