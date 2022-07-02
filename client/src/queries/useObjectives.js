import { useQuery } from 'react-query'

import CONFIG from '../config'
import { handleErrors } from '../shared/errorHandling'
import { useGameVersion } from '../GameContentsPicker/useGameVersion'

const queryKey = (gameVersion) => ['objectives', gameVersion]

export const useObjectives = () => {
  const { gameVersion } = useGameVersion()

  const { data: objectives, ...queryInfo } = useQuery(
    queryKey(gameVersion),
    async () => {
      const result = await fetch(`${CONFIG.apiUrl}/api/objectives`, {
        headers: {
          'x-ti4companion-game-version': gameVersion,
        },
      }).then(handleErrors)

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
