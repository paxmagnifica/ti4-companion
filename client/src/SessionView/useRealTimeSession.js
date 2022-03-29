import { useEffect } from 'react'

import { useSignalRConnection } from '../signalR'
import useInvalidateQueries from '../useInvalidateQueries'

export const useRealTimeSession = ({ sessionId }) => {
  const signalRConnection = useSignalRConnection()
  const invalidateQueries = useInvalidateQueries()

  useEffect(() => {
    if (!signalRConnection) {
      return () => null
    }

    const handler = (sessionEvent) => {
      if (
        // TODO also check if we are currently viewing the session?
        sessionEvent.eventType === 'CommitDraft' &&
        sessionId === sessionEvent.sessionId
      ) {
        window.location.reload()
      }

      invalidateQueries(['session', sessionEvent.sessionId])
    }
    signalRConnection.on('SessionEvent', handler)

    return () => signalRConnection.off('SessionEvent', handler)
  }, [signalRConnection, sessionId, invalidateQueries])

  useEffect(() => {
    if (!sessionId || !signalRConnection) {
      return () => null
    }

    signalRConnection.invoke('UnsubscribeFromSession', sessionId)
    signalRConnection.invoke('SubscribeToSession', sessionId)

    return () => signalRConnection.invoke('UnsubscribeFromSession', sessionId)
  }, [signalRConnection, sessionId])
}
