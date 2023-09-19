import { Typography } from '@material-ui/core'
import { ColorBox } from '../../../../../shared'
import { FactionImage } from '../../../../../shared/FactionImage'
import { Initiative } from './Initiative'

export function Choice({ action, choice, mapPositions }) {
  if (action === 'faction') {
    return (
      <FactionImage
        factionKey={choice}
        style={{ width: 'auto', height: '100%' }}
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
          gridColumnGap: '0.2em',
          alignItems: 'center',
        }}
      >
        <Typography>{map.name}</Typography>
        <ColorBox color={map.color} disabled />
      </div>
    )
  }

  return null
}
