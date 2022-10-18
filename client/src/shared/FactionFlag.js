import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import { useParams } from 'react-router-dom'
import { useTranslation } from '../i18n'

import { usePlasticColors } from './plasticColors'
import { FactionImage } from './FactionImage'
import { useSession } from '../SessionView/queries'

const useFlagStyles = makeStyles({
  root: {
    width: ({ width }) => `calc(${width} - 2px)`,
    height: ({ height }) => `calc(${height} - 2px)`,
    backgroundColor: ({ selected }) =>
      `rgba(255, 255, 255, ${selected ? '0.9' : '0.3'})`,
    borderRadius: '7%',
    cursor: ({ disabled }) => (disabled ? 'default' : 'pointer'),
    display: 'flex',
    justifyContent: 'center',
    border: ({ plasticColor, borderWidth }) =>
      plasticColor ? `${borderWidth} solid ${plasticColor}` : '',
    margin: '1px 1px',
  },
  factionImage: {
    opacity: ({ selected }) => (selected ? 1 : 0.6),
    height: '100%',
    width: 'auto',
    backgroundSize: 'contain',
    backgroundRepeat: 'none',
  },
})

function FactionFlag(
  {
    disabled,
    factionKey,
    selected,
    onClick,
    width,
    height,
    className,
    borderWidth,
  },
  ref,
) {
  const { t } = useTranslation()
  const getPlasticColor = usePlasticColors()
  const plasticColor = getPlasticColor(factionKey)
  const classes = useFlagStyles({
    borderWidth: borderWidth ?? '2px',
    selected,
    width,
    height,
    disabled,
    plasticColor: plasticColor?.hex,
  })
  const { sessionId } = useParams()
  const { session } = useSession({
    sessionId,
  })

  const playerName = session.players.find(
    (player) => player.faction === factionKey,
  )?.playerName

  return (
    <div
      ref={ref}
      className={clsx(classes.root, className)}
      onClick={disabled ? undefined : onClick}
    >
      <FactionImage
        className={classes.factionImage}
        factionKey={factionKey}
        title={`${t(`factions.${factionKey}.name`)} ${
          playerName ? `(${playerName})` : ''
        } ${
          plasticColor
            ? `(${t(`general.labels.colors.${plasticColor.color}`)})`
            : ''
        }`}
      />
    </div>
  )
}

export default React.forwardRef(FactionFlag)
