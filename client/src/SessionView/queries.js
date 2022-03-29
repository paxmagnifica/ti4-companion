import { useQuery } from 'react-query'

import CONFIG from '../config'
import { handleErrors } from '../shared/errorHandling'
import { useFetch } from '../useFetch'

export const sessionViewKeys = {
  session: (sessionId) => ['session', sessionId, 'data'],
}

export const useSession = ({ sessionId }) => {
  const { fetch } = useFetch()

  const { data, ...queryInfo } = useQuery(
    sessionViewKeys.session(sessionId),
    async () => {
      const result = await fetch(
        `${CONFIG.apiUrl}/api/sessions/${sessionId}`,
      ).then(handleErrors)

      const session = await result.json()

      return session
    },
    {
      enabled: Boolean(sessionId),
    },
  )

  return {
    session: data,
    queryInfo,
  }
}
