import React, { useMemo, useState, useCallback, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import { DomainErrorContext, useDomainErrors } from '../shared/errorHandling'
import sessionServiceFactory from '../shared/sessionService'
import { PlasticColorsProvider } from '../shared/plasticColors'
import { ComboDispatchContext } from '../state'
import { FetchContext, useFetch } from '../useFetch'
import { useGameVersion } from '../GameComponents'

import { useEdit, EditPromptProvider } from './Edit'
import { useSessionContext, SessionContext } from './useSessionContext'
import { useSession } from './queries'
import { useRealTimeSession } from './useRealTimeSession'

export const useSessionSecret = () => {
  const context = useSessionContext()

  if (!context) {
    return { setSecret: () => null }
  }

  return { setSecret: context.setSecret }
}

export function SessionContainer({ children }) {
  const { sessionId } = useParams()
  const history = useHistory()
  const { fetch } = useFetch()
  const { setError } = useDomainErrors()

  const [secret, setSecret] = useState(
    () =>
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
  }, [secret, fetch])

  const editFeature = useEdit()
  const { setEnableEditDialogOpen } = editFeature
  const originalDomainErrorContext = useContext(DomainErrorContext)
  const setSessionError = useCallback(
    (e) => {
      if (e.domain && e.status === 401) {
        setEnableEditDialogOpen(true)
      }

      setError(e)
    },
    [setError, setEnableEditDialogOpen],
  )

  const { setGameVersion } = useGameVersion()
  const { session, queryInfo } = useSession({
    sessionId,
    callback: (s) => setGameVersion(s.setup.gameVersion),
  })
  useRealTimeSession({ sessionId })
  const loading = !queryInfo.isFetched

  const sessionService = useMemo(
    () =>
      sessionServiceFactory({
        fetch: authorizedFetch,
        checksum: session?.checksum,
      }),
    [authorizedFetch, session?.checksum],
  )

  const pushEvent = useCallback(
    async (action) => {
      const { payload } = action

      try {
        await sessionService.pushEvent(payload.sessionId, {
          type: action.type,
          payload,
        })

        return true
      } catch (e) {
        setSessionError(e)

        return false
      }
    },
    [setSessionError, sessionService],
  )

  const updateFactionPoints = useCallback(
    async ({ sessionId: targetSessionId, faction, points }) => {
      const payload = { sessionId: targetSessionId, faction, points }

      await pushEvent({ type: 'VictoryPointsUpdated', payload })
    },
    [pushEvent],
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
      const stringified = JSON.stringify(sessions)
      localStorage.setItem('paxmagnifica-ti4companion-sessions', stringified)
    }
    setSecret(null)
    history.replace(history.location.pathname, {})
  }, [sessionId, setSecret, history])

  const contextValue = useMemo(
    () => ({
      session,
      loading,
      editable: Boolean(secret) && Boolean(session?.editable),
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
      editFeature,
    }),
    [
      editFeature,
      session,
      sessionId,
      secret,
      loading,
      updateFactionPoints,
      sessionService,
      setSecret,
      disableEdit,
    ],
  )

  return (
    <FetchContext.Provider value={{ fetch: authorizedFetch }}>
      <DomainErrorContext.Provider
        value={{
          ...originalDomainErrorContext,
          setError: setSessionError,
        }}
      >
        <ComboDispatchContext.Provider value={pushEvent}>
          <PlasticColorsProvider
            hide={!showPlasticColors}
            plasticColors={session?.colors}
            toggle={togglePlasticColors}
          >
            <SessionContext.Provider value={contextValue}>
              {children}
              <EditPromptProvider />
            </SessionContext.Provider>
          </PlasticColorsProvider>
        </ComboDispatchContext.Provider>
      </DomainErrorContext.Provider>
    </FetchContext.Provider>
  )
}
