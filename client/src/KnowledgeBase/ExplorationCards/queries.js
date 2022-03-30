import { useQuery } from 'react-query'

import CONFIG from '../../config'
import { handleErrors } from '../../shared/errorHandling'

const queryKey = ['explorationCards']

// TODO could set a very high TTL
export const useExplorationCards = () => {
  const { data: explorationCards, ...queryInfo } = useQuery(
    queryKey,
    async () => {
      const result = await fetch(`${CONFIG.apiUrl}/api/explorationCards`).then(
        handleErrors,
      )

      const results = await result.json()

      return results.reduce((accu, obj) => ({ ...accu, [obj.slug]: obj }), {})
    },
  )

  return {
    explorationCards,
    queryInfo,
  }
}
