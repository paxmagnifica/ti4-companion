using System;

namespace Server.Infra
{
    [Serializable]
    internal class TICompanionException : Exception
    {
        public TICompanionException()
            : base("Unknown TI Companion exception")
        {
        }

        public TICompanionException(string message)
            : base(message)
        {
        }
    }
}
