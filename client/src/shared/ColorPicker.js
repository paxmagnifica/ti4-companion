import { useState } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import { colors as plasticColors, colorNames } from './plasticColors'

import { ColorBox } from './ColorBox'

export function ColorPicker({
  disabled,
  color,
  onChange,
  size = '2em',
  style,
}) {
  const displayedColor = color ?? 'rgba(255, 255, 255, 0.2)'
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpenPicker = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePickColor = (plasticColor) => {
    if (Object.values(plasticColors).includes(plasticColor)) {
      onChange(plasticColor)
    }

    setAnchorEl(null)
  }

  return (
    <>
      <ColorBox
        color={displayedColor}
        disabled={disabled}
        onClick={handleOpenPicker}
        size={size}
        style={style}
        title={color ? colorNames[color] : 'No color selected'}
      />
      {!disabled && (
        <Menu
          anchorEl={anchorEl}
          keepMounted
          onClose={handlePickColor}
          open={Boolean(anchorEl)}
        >
          {Object.entries(plasticColors).map(([name, plasticColor]) => (
            <MenuItem
              key={plasticColor}
              onClick={() => handlePickColor(plasticColor)}
            >
              <ColorBox color={plasticColor} style={{ marginRight: '0.3em' }} />{' '}
              {name}
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  )
}
