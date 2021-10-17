import { useMemo, useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import shuffle from 'lodash.shuffle'

import sessionServiceFactory from '../shared/sessionService'
import { ComboDispatchContext } from '../state'

export function SessionProvider({
  children,
  state,
  dispatch,
}) {
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

  const sessionService = useMemo(() => sessionServiceFactory({ fetch: authorizedFetch }), [authorizedFetch])

  const comboDispatch = useCallback(action => {
    const { payload } = action
    sessionService.pushEvent(payload.sessionId, { type: action.type, payload })
    dispatch(action)
  }, [dispatch, sessionService])
  const { sessions } = state

  const shuffleFactions = useCallback(sessionId => {
    const session = sessions.data.find(s => s.id === sessionId)
    const shuffledFactions = shuffle(session.factions)
    const payload = { factions: shuffledFactions, sessionId }
    comboDispatch({ type: 'FactionsShuffled', payload })
  }, [sessions.data, comboDispatch])

  const setFactions = useCallback((sessionId, factions) => {
    const payload = { factions, sessionId }
    comboDispatch({ type: 'FactionsShuffled', payload })
  }, [comboDispatch])

  const updateFactionPoints = useCallback(({ sessionId, faction, points }) => {
    const payload = { sessionId, faction, points }
    comboDispatch({ type: 'VictoryPointsUpdated', payload })
  }, [comboDispatch])

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
        dispatch({ type: 'AddSession', session});
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [loading, dispatch, state.sessions.data, sessionId, sessionService, secret])

  const session = useMemo(() => state.sessions.data.find(s => s.id === sessionId), [state, sessionId])

  if (!sessionId) {
    return null
  }

  return <ComboDispatchContext.Provider value={comboDispatch}>
    {children({
      session,
      loading: loading || state.objectives.loading,
      editable,
      shuffleFactions,
      setFactions,
      updateFactionPoints,
      sessionService,
    })}
  </ComboDispatchContext.Provider>
}
