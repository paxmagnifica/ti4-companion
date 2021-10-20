import { useEffect, useContext } from 'react'

import { SignalRConnectionContext } from '../signalR'
import { DispatchContext } from '../state'

const useRealTimeSession = (sessionId) => {
  const signalRConnection = useContext(SignalRConnectionContext)
  const dispatch = useContext(DispatchContext)

  useEffect(() => {
    signalRConnection.on('SessionEvent', (sessionEvent) => {
      const payload = JSON.parse(sessionEvent.serializedPayload)
      dispatch({ type: sessionEvent.eventType, payload })
    })
  }, [signalRConnection, dispatch])

  useEffect(() => {
    if (!sessionId) {
      return () => null
    }

    signalRConnection.invoke('UnsubscribeFromSession', sessionId)
    signalRConnection.invoke('SubscribeToSession', sessionId)

    return () => signalRConnection.invoke('UnsubscribeFromSession', sessionId)
  }, [signalRConnection, sessionId])
}

export default useRealTimeSession
