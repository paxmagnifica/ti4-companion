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
    ({ sessionId: targetSessionId, faction, points }) => {
      const payload = { sessionId: targetSessionId, faction, points }
      comboDispatch({ type: 'VictoryPointsUpdated', payload })
    },
    [comboDispatch],
  )

  const [loading, setLoading] = useState(null)
  const [loadedSession, setLoadedSession] = useState(null)

  useEffect(() => {
    if (!sessionId) {
      return
    }

    const loadSession = async () => {
      setLoadedSession(null)
      setLoading(true)

      try {
        const session = await sessionService.get(sessionId)
        if (session.status === 404) {
          throw new Error('what')
        }

        session.remote = true
        dispatch({ type: 'AddSession', session })
        setLoadedSession(session)
      } catch (e) {
        setLoadedSession({ error: 'Not found' })
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [dispatch, sessionId, sessionService])

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
      const stringified = JSON.stringify(sessions)
      localStorage.setItem('paxmagnifica-ti4companion-sessions', stringified)
    }
    setSecret(null)
    history.replace(history.location.pathname, {})
  }, [sessionId, setSecret, history])

  const contextValue = useMemo(
    () => ({
      session: loadedSession,
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
      loadedSession,
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
        plasticColors={loadedSession?.colors}
        toggle={togglePlasticColors}
      >
        <SessionContext.Provider value={contextValue}>
          {children}
        </SessionContext.Provider>
      </PlasticColorsProvider>
    </ComboDispatchContext.Provider>
  )
}
