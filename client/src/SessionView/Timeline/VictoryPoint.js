import { Trans, useTranslation } from 'react-i18next'
import { Typography } from '@material-ui/core'

import FactionFlag from '../../shared/FactionFlag'
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

function Context({ source, context }) {
  switch (source) {
    case VP_SOURCE.support:
      return (
        <>
          <br />
          <Typography variant="caption">
            <Trans i18nKey="general.from" />
            <FactionFlag
              disabled
              factionKey={context}
              height="3em"
              selected
              width="4.5em"
            />
          </Typography>
        </>
      )
    default:
      return null
  }
}

export function VictoryPoint({ src, context }) {
  const { t } = useTranslation()
  const source = mapVpSource(src)

  if (!source || source === VP_SOURCE.other) {
    return null
  }

  const readable = t(`sessionTimeline.vpSource.${source}`)
  const image = images[source]

  return (
    <>
      {image && (
        <>
          <img
            alt={readable}
            src={image}
            style={{ maxWidth: '150px' }}
            title={readable}
          />
          <br />
        </>
      )}
      <Typography variant="caption">{readable}</Typography>
      <Context context={context} source={source} />
    </>
  )
}
