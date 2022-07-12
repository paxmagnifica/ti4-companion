import { useQuery } from 'react-query'

import CONFIG from '../../config'
import { handleErrors } from '../../shared/errorHandling'
import { useGameVersion } from '../../GameComponents'

const queryKey = (gameVersion) => ['relics', gameVersion]

export const useRelics = () => {
  const { gameVersion } = useGameVersion()

  const { data: relics, ...queryInfo } = useQuery(
    queryKey(gameVersion),
    async () => {
      const result = await fetch(`${CONFIG.apiUrl}/api/relics`, {
        headers: {
          'x-ti4companion-game-version': gameVersion,
        },
      }).then(handleErrors)

      const results = await result.json()

      return results.reduce((accu, obj) => ({ ...accu, [obj.slug]: obj }), {})
    },
    { placeholderData: {} },
  )

  return {
    relics,
    queryInfo,
  }
}
