import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import * as factions from './gameInfo/factions'

const useFlagStyles = makeStyles({
  root: {
    width: ({ width }) => width,
    height: ({ height }) => height,
    backgroundColor: ({ selected }) => `rgba(255, 255, 255, ${selected ? '1' : '0.3'})`,
    borderRadius: '4%',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
  },
  factionImage: {
    opacity: ({ selected }) => selected ? 1 : 0.5,
    height: '100%',
    width: 'auto',
    backgroundSize: 'contain',
    backgroundRepeat: 'none',
  }
})

function FactionFlag({
  factionKey,
  selected,
  onClick,
  width,
  height,
}, ref) {
  const classes = useFlagStyles({
    selected,
    width,
    height,
  })
  const factionData = factions.getData(factionKey)

  return <div className={classes.root}>
    <img
      ref={ref}
      className={classes.factionImage}
      onClick={onClick}
      src={factionData.image}
      alt={factionKey}
      title={factionData.name}
    />
  </div>
}

export default React.forwardRef(FactionFlag)
