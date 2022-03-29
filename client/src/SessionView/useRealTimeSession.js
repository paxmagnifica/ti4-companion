import { useEffect } from 'react'
import { useQueryClient } from 'react-query'

import { useSignalRConnection } from '../signalR'

export const useRealTimeSession = ({ sessionId }) => {
  const signalRConnection = useSignalRConnection()
  const queryClient = useQueryClient()

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

      queryClient.invalidateQueries(['session', sessionEvent.sessionId])
    }
    signalRConnection.on('SessionEvent', handler)

    return () => signalRConnection.off('SessionEvent', handler)
  }, [signalRConnection, sessionId, queryClient])

  useEffect(() => {
    if (!sessionId || !signalRConnection) {
      return () => null
    }

    signalRConnection.invoke('UnsubscribeFromSession', sessionId)
    signalRConnection.invoke('SubscribeToSession', sessionId)

    return () => signalRConnection.invoke('UnsubscribeFromSession', sessionId)
  }, [signalRConnection, sessionId])
}
