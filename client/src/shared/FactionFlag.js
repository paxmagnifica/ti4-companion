import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import * as factions from '../gameInfo/factions'

const useFlagStyles = makeStyles({
  root: {
    width: ({ width }) => `calc(${width} - 2px)`,
    height: ({ height }) => `calc(${height} - 2px)`,
    backgroundColor: ({ selected }) => `rgba(255, 255, 255, ${selected ? '0.9' : '0.3'})`,
    borderRadius: '7%',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    margin: '1px 1px',
  },
  factionImage: {
    opacity: ({ selected }) => selected ? 1 : 0.6,
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

  return <div
    className={classes.root}
    onClick={onClick}
    ref={ref}
  >
    <img
      className={classes.factionImage}
      src={factionData.image}
      alt={factionKey}
      title={factionData.name}
    />
  </div>
}

export default React.forwardRef(FactionFlag)
