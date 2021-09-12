import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDrag, useDrop } from 'react-dnd'
import {
  Grid,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery';

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
  imgStyles,
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
    width: props => props.containerWidth,
    height: props => props.containerHeight,
    cursor: 'pointer',
  }
})

const VICTORY_POINTS_SPRITE_BIG = {
  containerWidth: 89,
  containerHeight: 105,
  imgXOffset: 41,
  imgWidth: 89,
  imgHeight: 105,
  imgYOffset: 18,
  imgScale: 'scale(1)',
}

const VICTORY_POINTS_SPRITE_SMALL = {
  containerWidth: 44,
  containerHeight: 52,
  imgXOffset: 41,
  imgWidth: 89,
  imgHeight: 105,
  imgYOffset: 18,
  imgScale: 'scale(0.5) translateX(-50%)',
}

function VictoryPoints({
  onChange,
  factions,
  points,
}) {
  const smallViewport = useMediaQuery('(max-width:649px)');
  const spriteValues = smallViewport ? VICTORY_POINTS_SPRITE_SMALL : VICTORY_POINTS_SPRITE_BIG

  const classes = useVPStyles(spriteValues)

  return <DndProvider backend={HTML5Backend}>
    <Grid container justifyContent='center'>
      {[...Array(11).keys()].map(numberOfPoints => {
        const factionsWithThisManyPoints = points.filter(({faction, points}) => points === numberOfPoints)

        const imgStyles = {
          objectFit: 'none',
          objectPosition: `-${spriteValues.imgXOffset + spriteValues.imgWidth*numberOfPoints}px -${spriteValues.imgYOffset}px`,
          width: spriteValues.imgWidth,
          height: spriteValues.imgHeight,
          position: 'absolute',
          transform: spriteValues.imgScale,
          zIndex: -1,
          pointerEvents: 'none',
        }

        if (numberOfPoints === 0) {
          imgStyles.borderTopLeftRadius = '2%';
          imgStyles.borderBottomLeftRadius = '40%';
        }

        if (numberOfPoints === 10) {
          imgStyles.borderTopRightRadius = '20%';
          imgStyles.borderBottomRightRadius = '2%';
        }

        return <PointContainer
          className={classes.points}
          imgStyles={imgStyles}
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
