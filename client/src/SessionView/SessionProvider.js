import { useMemo, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import * as sessionService from '../shared/sessionService'

export function SessionProvider({
  children,
  state,
  dispatch,
}) {
  const { sessionId, secret } = useParams()

  const [loading, setLoading] = useState(null)
  const [editable, setEditable] = useState(false)

  useEffect(() => {
    if (!sessionId) {
      return
    }

    if (loading !== null) {
      return
    }

    const loadSession = async () => {
      setLoading(true)

      try {
        const session = await sessionService.get(sessionId, secret)
        setEditable(Boolean(session.editable))
        session.remote = true
        dispatch({ type: 'AddSession', session});
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [loading, dispatch, state.sessions.data, sessionId, secret])

  const session = useMemo(() => state.sessions.data.find(s => s.id === sessionId), [state, sessionId])

  if (!sessionId) {
    return null
  }

  return children(session, loading || state.objectives.loading, editable)
}
