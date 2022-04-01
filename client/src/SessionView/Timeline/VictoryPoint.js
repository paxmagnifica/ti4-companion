import { Trans, useTranslation } from 'react-i18next'
import { Typography } from '@material-ui/core'

import useSmallViewport from '../../shared/useSmallViewport'
import FactionFlag from '../../shared/FactionFlag'
import Relic from '../../shared/Relic'
import custodian from '../../assets/guac-mecatol.png'
import { VP_SOURCE } from '../../shared/constants'
import imperial from '../../assets/strat-8-imperial.png'

const images = {
  [VP_SOURCE.custodian]: custodian,
}

function Context({ source, context }) {
  switch (source) {
    case VP_SOURCE.support:
      return (
        Boolean(context) && (
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
      )
    default:
      return null
  }
}

export function VictoryPoint({ src, context }) {
  const { t } = useTranslation()
  const source = VP_SOURCE.fromBackendToFrontend(src)
  const small = useSmallViewport()

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
      {source === VP_SOURCE.mecatol && (
        <div
          style={{
            position: 'relative',
            borderRadius: '50%',
            height: 150,
            width: 150,
            overflow: 'hidden',
          }}
        >
          <img
            alt={readable}
            src={imperial}
            style={{ position: 'absolute', height: 600, top: -334, left: -428 }}
            title={readable}
          />
        </div>
      )}
      {source === VP_SOURCE.shard && (
        <>
          <Typography variant="h6">
            <Trans
              i18nKey={`sessionTimeline.vpSource.shardCaption.${context}`}
            />
          </Typography>
          <Relic slug="shard-of-the-throne" small={small} />
        </>
      )}
      <Typography variant="caption">{readable}</Typography>
      <Context context={context} source={source} />
    </>
  )
}
