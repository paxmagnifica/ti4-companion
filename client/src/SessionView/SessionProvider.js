import React, {
  useContext,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { useParams, useHistory } from 'react-router-dom'

import { useDomainErrors } from '../shared/errorHandling'
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
  const history = useHistory()
  const { setError } = useDomainErrors()
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
    async (action) => {
      const { payload } = action

      try {
        await sessionService.pushEvent(payload.sessionId, {
          type: action.type,
          payload,
        })

        dispatch(action)
      } catch (e) {
        if (e.domain) {
          setError(e)
        }

        throw e
      }
    },
    [setError, dispatch, sessionService],
  )

  const updateFactionPoints = useCallback(
    async ({ sessionId: targetSessionId, faction, points }) => {
      const payload = { sessionId: targetSessionId, faction, points }
      try {
        await comboDispatch({ type: 'VictoryPointsUpdated', payload })
      } catch (e) {
        // empty
      }
    },
    [comboDispatch],
  )

  const [loading, setLoading] = useState(null)
  const [sessionLoaded, setSessionLoaded] = useState(false)

  useEffect(() => {
    if (!sessionId) {
      return
    }

    const loadSession = async () => {
      setSessionLoaded(false)
      setLoading(true)

      try {
        const session = await sessionService.get(sessionId)
        if (session.status === 404) {
          session.error = 'Not Found'
        }

        session.remote = true
        dispatch({ type: 'AddSession', session })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
        setSessionLoaded(true)
      }
    }

    loadSession()
  }, [dispatch, sessionId, sessionService])

  const [showPlasticColors, setShowPlasticColors] = useState(true)
  const togglePlasticColors = useCallback(
    () => setShowPlasticColors((a) => !a),
    [],
  )

  const session = useMemo(
    () =>
      !sessionLoaded
        ? null
        : state.sessions.data.find((s) => s.id === sessionId),
    [state, sessionId, sessionLoaded],
  )

  const disableEdit = useCallback(() => {
    const sessions = JSON.parse(
      localStorage.getItem('paxmagnifica-ti4companion-sessions') || '{}',
    )
    if (sessions[sessionId]) {
      sessions[sessionId].secret = null
      const stringified = JSON.stringify(sessions)
      localStorage.setItem('paxmagnifica-ti4companion-sessions', stringified)
    }
    setSecret(null)
    history.replace(history.location.pathname, {})
  }, [sessionId, setSecret, history])

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
