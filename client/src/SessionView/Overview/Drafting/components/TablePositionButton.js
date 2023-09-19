import { Typography } from '@material-ui/core'
import { ColorBox } from '../../../../shared'
import { PickButton } from './PickButton'

export function TablePositionButton({
  map,
  picked,
  selected,
  onClick,
  disabled,
}) {
  return (
    <PickButton
      disabled={disabled}
      onClick={onClick}
      picked={picked}
      selected={selected}
    >
      <Typography
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gridColumnGap: '0.3em',
        }}
      >
        {map.name}
        <ColorBox color={map.color} disabled />
      </Typography>
    </PickButton>
  )
}
