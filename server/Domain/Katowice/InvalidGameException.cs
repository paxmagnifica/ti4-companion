using System;

namespace Server.Domain.Katowice
{
    [Serializable]
    public class InvalidGameException : Exception
    {
        public InvalidGameException()
            : base("Need Katowice game to run this operation")
        {
        }

        public InvalidGameException(string message)
            : base(message)
        {
        }
    }
}
