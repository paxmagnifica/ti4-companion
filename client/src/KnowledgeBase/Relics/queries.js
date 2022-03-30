import { useQuery } from 'react-query'

import CONFIG from '../../config'
import { handleErrors } from '../../shared/errorHandling'

const queryKey = ['relics']

// TODO could set a very high TTL
export const useRelics = () => {
  const { data: relics, ...queryInfo } = useQuery(queryKey, async () => {
    const result = await fetch(`${CONFIG.apiUrl}/api/relics`).then(handleErrors)

    const results = await result.json()

    return results.reduce((accu, obj) => ({ ...accu, [obj.slug]: obj }), {})
  })

  return {
    relics,
    queryInfo,
  }
}
