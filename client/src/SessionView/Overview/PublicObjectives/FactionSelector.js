import { useCallback } from 'react'
import {
  Grid,
} from '@material-ui/core'

import FactionFlag from '../../../shared/FactionFlag'

function FactionSelector({
  factions,
  value,
  onChange,
  small,
}) {
  const clicked = useCallback((factionKey, selected) => {
    if (selected) {
      onChange({ factionKey, event: 'selected' })
      return
    }

    onChange({ factionKey, event: 'deselected' })
    return
  }, [onChange])

  return <Grid container>
    {factions.map(factionKey => <FactionFlag
      width='25%'
      height={small ? '1em' : '2em'}
      key={factionKey}
      factionKey={factionKey}
      selected={value.includes(factionKey)}
      onClick={() => clicked(factionKey, !value.includes(factionKey))}
    />)}
  </Grid>
}

export default FactionSelector
