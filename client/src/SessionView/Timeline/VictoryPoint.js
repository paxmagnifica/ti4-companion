import { useTranslation } from 'react-i18next'
import { Typography } from '@material-ui/core'

import mecatol from '../../assets/guac-mecatol.png'

const VP_SOURCE = {
  other: 'other',
  objective: 'objective',
  mecatol: 'mecatol',
  support: 'support',
  emphidia: 'emphidia',
}

const mapVpSource = (src) => Object.values(VP_SOURCE)[src]

const images = {
  [VP_SOURCE.mecatol]: mecatol,
}

export function VictoryPoint({ src }) {
  const { t } = useTranslation()
  const source = mapVpSource(src)

  const readable = t(`sessionTimeline.vpSource.${source}`)

  return (
    <>
      <img
        alt={readable}
        src={images[source]}
        style={{ maxWidth: '150px' }}
        title={readable}
      />
      <br />
      <Typography variant="caption">{readable}</Typography>
    </>
  )
}
