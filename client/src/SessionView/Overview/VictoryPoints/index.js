import { DndProvider } from 'react-dnd'
import { TouchBackend } from 'react-dnd-touch-backend'
import clsx from 'clsx'
import {
  Grid,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import useSmallViewport from '../../../shared/useSmallViewport'
import vp0 from '../../../assets/victory-points-10/0.jpg'
import vp1 from '../../../assets/victory-points-10/1.jpg'
import vp2 from '../../../assets/victory-points-10/2.jpg'
import vp3 from '../../../assets/victory-points-10/3.jpg'
import vp4 from '../../../assets/victory-points-10/4.jpg'
import vp5 from '../../../assets/victory-points-10/5.jpg'
import vp6 from '../../../assets/victory-points-10/6.jpg'
import vp7 from '../../../assets/victory-points-10/7.jpg'
import vp8 from '../../../assets/victory-points-10/8.jpg'
import vp9 from '../../../assets/victory-points-10/9.jpg'
import vp10 from '../../../assets/victory-points-10/10.jpg'
import { useFullscreen } from '../../../Fullscreen'

import { PointContainer, DraggableFlag } from './draggableIndicators'

const vpImages = [vp0, vp1, vp2, vp3, vp4, vp5, vp6, vp7, vp8, vp9, vp10]

const useStyles = makeStyles({
  root: {
    width: '75%',
    margin: '0 auto',
  },
  fullWidth: {
    width: '100%',
  },
  fullscreen: {
    width: '130%',
    marginLeft: '-15%',
  },
  img: {
    minWidth: 50,
    position: 'relative',
    width: '9%',
    '&:first-child > img': {
      borderBottomLeftRadius: '45%',
    },
    '&:last-child > img': {
      borderTopRightRadius: '40%',
    },
    '& > img': {
      pointerEvents: 'none',
      width: '100%',
    },
  },
  dropContainerWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  dropContainer: {
    height: '73%',
    width: '100%',
  },
})

function VictoryPoints({
  onChange,
  factions,
  points,
}) {
  const smallViewport = useSmallViewport()
  const fullscreen = useFullscreen()
  const classes = useStyles({ smallViewport, fullscreen })

  return <DndProvider
    backend={TouchBackend}
    options={{ enableMouseEvents: true }}
  >
    <Grid container justifyContent='center' className={clsx(classes.root, { [classes.fullWidth]: smallViewport || fullscreen, [classes.fullscreen]: fullscreen })}>
      {[...Array(11).keys()].map(numberOfPoints => {
        const factionsWithThisManyPoints = points.filter(({faction, points}) => points === numberOfPoints)

        return <Grid item className={classes.img} key={numberOfPoints}>
          <img src={vpImages[numberOfPoints]} alt={`${numberOfPoints} victory points background`} />
          <Grid container className={classes.dropContainerWrapper} direction="column" alignItems="center" justifyContent="center">
            <PointContainer
              className={classes.dropContainer}
              points={numberOfPoints}
              id={numberOfPoints}
            >
              {factionsWithThisManyPoints.map(({faction}) => <DraggableFlag
                key={faction}
                factionKey={faction}
                updatePoints={points => onChange(faction, points)}
                onClick={() => onChange(faction, numberOfPoints + 1)}
              />)}
            </PointContainer>
          </Grid>
        </Grid>
      })}
    </Grid>
  </DndProvider>
}

export default VictoryPoints
