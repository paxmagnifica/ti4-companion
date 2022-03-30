import { useQuery } from 'react-query'

import CONFIG from '../config'
import { handleErrors } from '../shared/errorHandling'

const queryKey = ['objectives']

// TODO could set a very high TTL
export const useObjectives = () => {
  const { data: objectives, ...queryInfo } = useQuery(
    queryKey,
    async () => {
      const result = await fetch(`${CONFIG.apiUrl}/api/objectives`).then(
        handleErrors,
      )

      const availableObjectives = await result.json()

      return availableObjectives.reduce(
        (accu, obj) => ({ ...accu, [obj.slug]: obj }),
        {},
      )
    },
    {
      placeholderData: {},
    },
  )

  return {
    objectives,
    queryInfo,
  }
}
