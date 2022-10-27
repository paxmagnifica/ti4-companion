import { useCallback } from 'react'
import { Grid } from '@material-ui/core'

import PlayerFlag from '../../../PlayerFlag'

function FactionSelector({ disabled, factions, value, onChange, size }) {
  const clicked = useCallback(
    (factionKey, selected) => {
      if (selected) {
        onChange({ factionKey, event: 'selected' })

        return
      }

      onChange({ factionKey, event: 'deselected' })
    },
    [onChange],
  )

  return (
    <Grid container direction="column">
      {factions.map((factionKey) => (
        <PlayerFlag
          key={factionKey}
          disabled={disabled}
          factionKey={factionKey}
          height={{ small: '1.3em', fullscreen: '3.3vh' }[size] || '2em'}
          onClick={() => clicked(factionKey, !value.includes(factionKey))}
          selected={value.includes(factionKey)}
          width="auto"
        />
      ))}
    </Grid>
  )
}

export default FactionSelector
