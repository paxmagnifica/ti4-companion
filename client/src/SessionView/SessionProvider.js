import { useMemo, useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'

import sessionServiceFactory from '../shared/sessionService'
import { PlasticColorsProvider } from '../shared/plasticColors'
import { ComboDispatchContext } from '../state'

export function SessionProvider({ children, state, dispatch }) {
  const { sessionId, secret } = useParams()

  const authorizedFetch = useMemo(() => {
    if (!secret) {
      return fetch
    }

    return (link, options, ...rest) => {
      const modifiedOptions = {
        ...options,
        headers: {
          'x-ti4companion-session-secret': secret,
          ...options?.headers,
        },
      }

      return fetch(link, modifiedOptions, ...rest)
    }
  }, [secret])

  const sessionService = useMemo(
    () => sessionServiceFactory({ fetch: authorizedFetch }),
    [authorizedFetch],
  )

  const comboDispatch = useCallback(
    (action) => {
      const { payload } = action
      dispatch(action)

      return sessionService.pushEvent(payload.sessionId, {
        type: action.type,
        payload,
      })
    },
    [dispatch, sessionService],
  )

  const updateFactionPoints = useCallback(
    ({ sessionId: targetSessionId, faction, points }) => {
      const payload = { sessionId: targetSessionId, faction, points }
      comboDispatch({ type: 'VictoryPointsUpdated', payload })
    },
    [comboDispatch],
  )

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
        const session = await sessionService.get(sessionId)
        setEditable(secret && Boolean(session.editable))
        session.remote = true
        dispatch({ type: 'AddSession', session })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [
    loading,
    dispatch,
    state.sessions.data,
    sessionId,
    sessionService,
    secret,
  ])

  const session = useMemo(
    () => state.sessions.data.find((s) => s.id === sessionId),
    [state, sessionId],
  )

  const [showPlasticColors, setShowPlasticColors] = useState(true)
  const togglePlasticColors = useCallback(
    () => setShowPlasticColors((a) => !a),
    [],
  )

  if (!sessionId) {
    return null
  }

  return (
    <ComboDispatchContext.Provider value={comboDispatch}>
      <PlasticColorsProvider
        hide={!showPlasticColors}
        plasticColors={session?.colors}
        toggle={togglePlasticColors}
      >
        {children({
          session,
          loading: loading || state.objectives.loading,
          editable,
          updateFactionPoints,
          sessionService,
        })}
      </PlasticColorsProvider>
    </ComboDispatchContext.Provider>
  )
}
