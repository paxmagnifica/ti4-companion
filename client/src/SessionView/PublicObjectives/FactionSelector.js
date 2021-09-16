import { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import FactionFlag from '../../shared/FactionFlag'

const useSelectorStyles = makeStyles({
  root: {
    display: 'flex',
  }
})

function FactionSelector({
  factions,
  value,
  onChange,
  small,
}) {
  const classes = useSelectorStyles()

  const clicked = useCallback((factionKey, selected) => {
    if (selected) {
      onChange({ factionKey, event: 'selected' })
      return
    }

    onChange({ factionKey, event: 'deselected' })
    return
  }, [onChange])

  return <div className={classes.root}>
    {factions.map(factionKey => <FactionFlag
      width='25%'
      height={small ? '1em' : '2em'}
      key={factionKey}
      factionKey={factionKey}
      selected={value.includes(factionKey)}
      onClick={() => clicked(factionKey, !value.includes(factionKey))}
    />)}
  </div>
}

export default FactionSelector
