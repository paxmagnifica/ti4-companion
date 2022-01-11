import React, {
  useContext,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { useParams } from 'react-router-dom'

import sessionServiceFactory from '../shared/sessionService'
import { PlasticColorsProvider } from '../shared/plasticColors'
import { ComboDispatchContext } from '../state'

const SessionContext = React.createContext()

export const useSessionContext = () => useContext(SessionContext)
export const useSessionSecret = () => {
  const context = useContext(SessionContext)

  if (!context) {
    return { setSecret: () => null }
  }

  return { setSecret: context.setSecret }
}
export function SessionProvider({ children, state, dispatch }) {
  const { sessionId } = useParams()
  const [secret, setSecret] = useState(
    JSON.parse(
      localStorage.getItem('paxmagnifica-ti4companion-sessions') || '{}',
    )[sessionId]?.secret,
  )

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
        session.remote = true
        dispatch({ type: 'AddSession', session })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [loading, dispatch, state.sessions.data, sessionId, sessionService])

  const session = useMemo(
    () => state.sessions.data.find((s) => s.id === sessionId),
    [state, sessionId],
  )

  const [showPlasticColors, setShowPlasticColors] = useState(true)
  const togglePlasticColors = useCallback(
    () => setShowPlasticColors((a) => !a),
    [],
  )

  const disableEdit = useCallback(() => {
    const sessions = JSON.parse(
      localStorage.getItem('paxmagnifica-ti4companion-sessions') || '{}',
    )
    if (sessions[sessionId]) {
      sessions[sessionId].secret = null
      localStorage.setItem(
        'paxmagnifica-ti4companion-sessions',
        JSON.stringify(sessions),
      )
    }
    setSecret(null)
  }, [sessionId])

  const contextValue = useMemo(
    () => ({
      session,
      loading: loading || state.objectives.loading,
      editable: Boolean(secret),
      updateFactionPoints,
      sessionService,
      setSecret: (s) => {
        const sessions = JSON.parse(
          localStorage.getItem('paxmagnifica-ti4companion-sessions') || '{}',
        )
        if (!sessions[sessionId]) {
          sessions[sessionId] = { id: sessionId }
        }
        sessions[sessionId].secret = s
        localStorage.setItem(
          'paxmagnifica-ti4companion-sessions',
          JSON.stringify(sessions),
        )
        setSecret(s)
      },
      disableEdit,
    }),
    [
      session,
      sessionId,
      secret,
      loading,
      state.objectives.loading,
      updateFactionPoints,
      sessionService,
      setSecret,
      disableEdit,
    ],
  )

  return (
    <ComboDispatchContext.Provider value={comboDispatch}>
      <PlasticColorsProvider
        hide={!showPlasticColors}
        plasticColors={session?.colors}
        toggle={togglePlasticColors}
      >
        <SessionContext.Provider value={contextValue}>
          {children}
        </SessionContext.Provider>
      </PlasticColorsProvider>
    </ComboDispatchContext.Provider>
  )
}
