import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import * as sessionService from '../sessionService'

export function SessionProvider({
  children,
  state,
  dispatch,
}) {
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const sessionFromLocalStorage = useMemo(() => state.sessions.data.find(s => s.id === id), [state, id])
  const [foreignSession, setForeignSession] = useState(null)

  useEffect(() => {
    if (!id) {
      return
    }

    if (sessionFromLocalStorage) {
      setLoading(false)
      return
    }

    const loadSession = async () => {
      setLoading(true)

      try {
        const session = await sessionService.get(id)
        session.remote = true
        setForeignSession(session)
        dispatch({ type: 'loadSessions', sessions: [...state.sessions.data, session]});
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [dispatch, state.sessions.data, id, sessionFromLocalStorage])


  if (!id) {
    return null
  }

  return children(sessionFromLocalStorage || foreignSession, loading)
}
