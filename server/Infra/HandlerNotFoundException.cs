using System;

namespace Server.Infra
{
    [Serializable]
    internal class HandlerNotFoundException : TICompanionException
    {
        public HandlerNotFoundException(string handlerName)
            : base($"Handler with name {handlerName} not found")
        {
        }
    }
}
