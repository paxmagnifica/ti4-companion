import { useCallback } from 'react'
import {
  Grid,
} from '@material-ui/core'

import FactionFlag from '../../../shared/FactionFlag'

function FactionSelector({
  disabled,
  factions,
  value,
  onChange,
  size
}) {
  const clicked = useCallback((factionKey, selected) => {
    if (selected) {
      onChange({ factionKey, event: 'selected' })
      return
    }

    onChange({ factionKey, event: 'deselected' })
    return
  }, [onChange])

  return <Grid container direction='column'>
    {factions.map(factionKey => <FactionFlag
      disabled={disabled}
      width='auto'
      height={{ small: '1em', fullscreen: '3.3vh' }[size] || '2em'}
      key={factionKey}
      factionKey={factionKey}
      selected={value.includes(factionKey)}
      onClick={() => clicked(factionKey, !value.includes(factionKey))}
    />)}
  </Grid>
}

export default FactionSelector
