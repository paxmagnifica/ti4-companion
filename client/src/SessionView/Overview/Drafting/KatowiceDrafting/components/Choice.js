import { Typography } from '@material-ui/core'
import { Map as MapIcon } from '@material-ui/icons'
import { ColorBox } from '../../../../../shared'
import { FactionImage } from '../../../../../shared/FactionImage'
import { Initiative } from './Initiative'

export function Choice({ action, choice, mapPositions, height }) {
  if (action === 'faction') {
    return (
      <FactionImage
        factionKey={choice}
        style={{ width: 'auto', height: height || '100%' }}
      />
    )
  }

  if (action === 'initiative') {
    return <Initiative at={choice} />
  }

  if (action === 'tablePosition') {
    const map = mapPositions[choice]

    return (
      <div
        style={{
          display: 'flex',
          gridColumnGap: '0.1em',
          alignItems: 'center',
        }}
      >
        <MapIcon />
        <Typography>{map.name}</Typography>
        <ColorBox color={map.color} disabled />
      </div>
    )
  }

  return null
}
