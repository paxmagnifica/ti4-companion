import { useEffect, useContext } from 'react'

import { useSignalRConnection } from '../signalR'
import { DispatchContext } from '../state'

const useRealTimeSession = (sessionId) => {
  const signalRConnection = useSignalRConnection()
  const dispatch = useContext(DispatchContext)

  useEffect(() => {
    if (!signalRConnection) {
      return () => null
    }

    const handler = (sessionEvent) => {
      const payload = JSON.parse(sessionEvent.serializedPayload)
      if (
        // TODO also check if we are currently viewing the session?
        sessionEvent.eventType === 'CommitDraft' &&
        sessionId === sessionEvent.sessionId
      ) {
        window.location.reload()
      }

      dispatch({ type: sessionEvent.eventType, payload })
    }
    signalRConnection.on('SessionEvent', handler)

    return () => signalRConnection.off('SessionEvent', handler)
  }, [signalRConnection, dispatch, sessionId])

  useEffect(() => {
    if (!sessionId || !signalRConnection) {
      return () => null
    }

    signalRConnection.invoke('UnsubscribeFromSession', sessionId)
    signalRConnection.invoke('SubscribeToSession', sessionId)

    return () => signalRConnection.invoke('UnsubscribeFromSession', sessionId)
  }, [signalRConnection, sessionId])
}

export default useRealTimeSession
