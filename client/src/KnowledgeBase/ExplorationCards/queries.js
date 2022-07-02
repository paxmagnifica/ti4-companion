import { useQuery } from 'react-query'

import CONFIG from '../../config'
import { handleErrors } from '../../shared/errorHandling'
import { useGameVersion } from '../../GameComponents'

const queryKey = (gameVersion) => ['explorationCards', gameVersion]

export const useExplorationCards = () => {
  const { gameVersion } = useGameVersion()

  const { data: explorationCards, ...queryInfo } = useQuery(
    queryKey(gameVersion),
    async () => {
      const result = await fetch(`${CONFIG.apiUrl}/api/explorationCards`, {
        headers: {
          'x-ti4companion-game-version': gameVersion,
        },
      }).then(handleErrors)

      const results = await result.json()

      return results.reduce((accu, obj) => ({ ...accu, [obj.slug]: obj }), {})
    },
    {
      staleTime: Infinity,
    },
  )

  return {
    explorationCards,
    queryInfo,
  }
}
