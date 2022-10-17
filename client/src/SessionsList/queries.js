import { useCallback } from 'react'
import { useQuery, useQueryClient } from 'react-query'

import CONFIG from '../config'
import { handleErrors } from '../shared/errorHandling'
import { useFetch } from '../useFetch'

export const sessionListKeys = {
  list: (listId) => ['sessions', listId],
}

export const useSessionsList = ({ listId }) => {
  const { fetch } = useFetch()
  const queryClient = useQueryClient()

  const invalidateSessions = useCallback(() => {
    queryClient.invalidateQueries(sessionListKeys.list(listId))
  }, [queryClient, listId])

  const { data, ...queryInfo } = useQuery(
    sessionListKeys.list(listId),
    async () => {
      const result = await fetch(
        `${CONFIG.apiUrl}/api/sessionList/${listId}`,
      ).then(handleErrors)

      const sessionList = await result.json()

      const secrets = JSON.parse(
        localStorage.getItem('paxmagnifica-ti4companion-sessions') || '{}',
      )

      return sessionList.map((session) => ({
        ...session,
        ...(secrets[session.id] || {}),
      }))
    },
    {
      enabled: Boolean(listId),
      placeholderData: [],
    },
  )

  return {
    sessions: data,
    queryInfo,
    invalidateSessions,
  }
}
