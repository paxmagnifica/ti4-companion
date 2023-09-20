import { Typography } from '@material-ui/core'
import { Map as MapIcon } from '@material-ui/icons'
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
      <MapIcon />
      <Typography>{map.name}</Typography>
      <ColorBox color={map.color} disabled />
    </PickButton>
  )
}
