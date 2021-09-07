import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDrag, useDrop } from 'react-dnd'
import {
  Grid,
  Avatar,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import * as factions from '../gameInfo/factions'

const DRAGGABLE = {
  FLAG: 'flag'
}

const useFlagStyles = makeStyles({
  flag: {
    width: '44%',
    marginLeft: '3%',
    height: 'auto',
    '&:hover': {
      backgroundColor: 'rgb(63 81 181 / 8%)',
    },
  }
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

  return <Grid
    ref={drop}
    className={className}
    item
    justifyContent='center'
    xs={2}
    md={1}
    container
    direction='column'
  >
    <div className='points-count'>{points}</div>
    {children}
  </Grid>
}

const useVPStyles = makeStyles({
  points: {
    position: 'relative',
    '& .points-count': {
      borderLeft: '1px solid black',
      borderTop: '1px solid black',
      borderBottom: '1px solid black',
      borderRight: '1px solid black',
      marginLeft: '-1px',
      marginTop: '-1px',
      zIndex: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '2em',
      fontWeight: 'bold',
      position: 'absolute',
      left: 0, right: 0,
      textAlign: 'center',
    },
    '& >*:not(.points-count)': {
      cursor: 'pointer',
      zIndex: 1,
    }
  }
})

function VictoryPoints({
  onChange,
  factions,
}) {
  const classes = useVPStyles()

  const [points, setPoints] = useState(factions.map(faction => ([faction, 0])))

  return <DndProvider backend={HTML5Backend}>
    <Grid container justifyContent='center'>
      {[...Array(11).keys()].map(numberOfPoints => {
        const factionsWithThisManyPoints = points.filter(([faction, points]) => points === numberOfPoints)

        return <PointContainer
          className={classes.points}
          points={numberOfPoints}
          id={numberOfPoints}
        >
          {factionsWithThisManyPoints.map(([faction]) => <Flag
            key={faction}
            factionKey={faction}
            updatePoints={points => setPoints(pointsState => pointsState.map(([f, previousPoints]) => f === faction ? [f, points] : [f, previousPoints]))}
          />)}
        </PointContainer>
      })}
    </Grid>
  </DndProvider>
}

export default VictoryPoints
