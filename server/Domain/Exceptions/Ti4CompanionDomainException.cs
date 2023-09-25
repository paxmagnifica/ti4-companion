using System;

namespace Server.Domain.Exceptions
{
    [Serializable]
    public class Ti4CompanionDomainException : Exception
    {
        public Ti4CompanionDomainException(string message, string key = null)
            : base(message)
        {
            this.ErrorKey = key ?? "something_went_wrong";
        }

        public string ErrorKey { get; internal set; }
    }
}
