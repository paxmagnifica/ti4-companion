import { useQuery } from 'react-query'

import CONFIG from '../../config'
import { handleErrors } from '../../shared/errorHandling'
import { useGameVersion } from '../../GameComponents'

const queryKey = (gameVersion) => ['techs', gameVersion]

export const useTechs = () => {
  const { gameVersion } = useGameVersion()

  const { data: techs, ...queryInfo } = useQuery(
    queryKey(gameVersion),
    async () => {
      const result = await fetch(`${CONFIG.apiUrl}/api/tech`, {
        headers: {
          'x-ti4companion-game-version': gameVersion,
        },
      }).then(handleErrors)

      const results = await result.json()

      return {
        techs: results.techs
          .sort((a, b) => {
            if (a.type !== b.type) {
              return a.type - b.type
            }

            return a.level - b.level
          })
          .reduce((accu, obj) => ({ ...accu, [obj.slug]: obj }), {}),
        units: results.units.reduce(
          (accu, obj) => ({ ...accu, [obj.slug]: obj }),
          {},
        ),
      }
    },
    { placeholderData: {} },
  )

  return {
    techs,
    queryInfo,
  }
}
