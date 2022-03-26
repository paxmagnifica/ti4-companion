import { useQuery } from 'react-query'

import CONFIG from '../config'
import { handleErrors } from '../shared/errorHandling'

export const sessionListKeys = {
  list: (listId) => ['sessions', listId],
}

export const useSessionsList = ({ listId }) => {
  const { data, ...queryInfo } = useQuery(
    sessionListKeys.list(listId),
    async () => {
      const result = await fetch(
        `${CONFIG.apiUrl}/api/sessionList/${listId}`,
      ).then(handleErrors)

      const sessionList = await result.json()

      return sessionList
    },
    {
      enabled: Boolean(listId),
      placeholderData: [],
    },
  )

  return {
    sessions: data,
    queryInfo,
  }
}
