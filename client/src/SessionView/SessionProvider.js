import { useMemo, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import * as sessionService from '../shared/sessionService'

export function SessionProvider({
  children,
  state,
  dispatch,
}) {
  const { id } = useParams()

  const [loading, setLoading] = useState(null)

  useEffect(() => {
    if (!id) {
      return
    }

    if (loading !== null) {
      return
    }

    const loadSession = async () => {
      setLoading(true)

      try {
        const session = await sessionService.get(id)
        session.remote = true
        dispatch({ type: 'AddSession', session});
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [loading, dispatch, state.sessions.data, id])

  const session = useMemo(() => state.sessions.data.find(s => s.id === id), [state, id])

  if (!id) {
    return null
  }

  return children(session, loading || state.objectives.loading)
}
