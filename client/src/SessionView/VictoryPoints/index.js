import { DndProvider } from 'react-dnd'
import { TouchBackend } from 'react-dnd-touch-backend'
import {
  Grid,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import useSmallViewport from '../../shared/useSmallViewport'

import { PointContainer, DraggableFlag } from './draggableIndicators'

const useStyles = makeStyles({
  points: {
    position: 'relative',
    width: props => props.containerWidth,
    height: props => props.containerHeight,
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
  imgScale: 'scale(0.5) translateX(-50%) translateY(-50%)',
}

function VictoryPoints({
  onChange,
  factions,
  points,
}) {
  const smallViewport = useSmallViewport()
  const spriteValues = smallViewport ? VICTORY_POINTS_SPRITE_SMALL : VICTORY_POINTS_SPRITE_BIG

  const classes = useStyles(spriteValues)

  return <DndProvider
    backend={TouchBackend}
    options={{ enableMouseEvents: true }}
  >
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
          {factionsWithThisManyPoints.map(({faction}) => <DraggableFlag
            key={faction}
            factionKey={faction}
            updatePoints={points => onChange(faction, points)}
            onClick={() => onChange(faction, numberOfPoints + 1)}
          />)}
        </PointContainer>
      })}
    </Grid>
  </DndProvider>
}

export default VictoryPoints
