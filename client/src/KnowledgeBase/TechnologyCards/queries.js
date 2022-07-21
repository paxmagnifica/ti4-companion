import { useQuery } from 'react-query'

import CONFIG from '../../config'
import { handleErrors } from '../../shared/errorHandling'
import { useGameVersion } from '../../GameComponents'

const queryKey = (gameVersion) => ['techs', gameVersion]

export const useTechs = () => {
  return {
    techs: [],
    queryInfo: {
      isFetched: true,
    },
  }

  const { gameVersion } = useGameVersion()

  const { data: techs, ...queryInfo } = useQuery(
    queryKey(gameVersion),
    async () => {
      const result = await fetch(`${CONFIG.apiUrl}/api/techs`, {
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
    techs,
    queryInfo,
  }
}
