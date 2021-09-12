import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDrag, useDrop } from 'react-dnd'
import {
  Grid,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import victoryPointsBackground from '../assets/victory-points-background.jpg'
import * as factions from '../gameInfo/factions'

const DRAGGABLE = {
  FLAG: 'flag'
}

const useFlagStyles = makeStyles({
  flag: {
    width: '44%',
    marginLeft: '3%',
    height: 'auto',
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    '&:hover': {
      backgroundColor: 'white',
    },
  },
})

function Flag({
  factionKey,
  updatePoints,
}) {
  const classes = useFlagStyles()

  const [{isDragging}, drag] = useDrag(() => ({
    type: DRAGGABLE.FLAG,
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (_, monitor) => {
      const result = monitor.getDropResult()

      if (result) {
        updatePoints(monitor.getDropResult().points)
      }
    },
  }), [updatePoints])

  const factionData = factions.getData(factionKey)

  return <img className={classes.flag} ref={drag} src={factionData.image} alt={factionKey} />
}

function PointContainer({
  className,
  children,
  points,
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: DRAGGABLE.FLAG,
    drop: () => ({ points, }),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }), [])

  const imgStyles = {
    objectFit: 'none',
    objectPosition: `-${38 + 89*points}px -18px`,
    width: 91,
    height: 105,
    position: 'absolute',
    zIndex: -1,
    pointerEvents: 'none',
  }

  if (points === 0) {
    imgStyles.borderTopLeftRadius = '2%';
    imgStyles.borderBottomLeftRadius = '40%';
  }

  if (points === 10) {
    imgStyles.borderTopRightRadius = '20%';
    imgStyles.borderBottomRightRadius = '2%';
  }

  return <Grid
    ref={drop}
    className={className}
    item
    justifyContent='center'
    container
    direction='column'
  >
    {<img
      src={victoryPointsBackground}
      style={imgStyles}
    />}
    {children}
  </Grid>
}

const useVPStyles = makeStyles({
  points: {
    position: 'relative',
    width: 91,
    height: 105,
    cursor: 'pointer',
  }
})

function VictoryPoints({
  onChange,
  factions,
  points,
}) {
  const classes = useVPStyles()

  return <DndProvider backend={HTML5Backend}>
    <Grid container justifyContent='center'>
      {[...Array(11).keys()].map(numberOfPoints => {
        const factionsWithThisManyPoints = points.filter(({faction, points}) => points === numberOfPoints)

        return <PointContainer
          className={classes.points}
          points={numberOfPoints}
          id={numberOfPoints}
          key={numberOfPoints}
        >
          {factionsWithThisManyPoints.map(({faction}) => <Flag
            key={faction}
            factionKey={faction}
            updatePoints={points => onChange(faction, points)}
          />)}
        </PointContainer>
      })}
    </Grid>
  </DndProvider>
}

export default VictoryPoints
