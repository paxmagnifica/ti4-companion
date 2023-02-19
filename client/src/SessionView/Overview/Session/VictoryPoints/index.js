import { DndProvider } from 'react-dnd'
import { TouchBackend } from 'react-dnd-touch-backend'
import clsx from 'clsx'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import useSmallViewport from '../../../../shared/useSmallViewport'
import { useFullscreen } from '../../../../Fullscreen'
/* eslint-disable camelcase */
import vp10_0 from '../../../../assets/victory-points-10/0.jpg'
import vp10_1 from '../../../../assets/victory-points-10/1.jpg'
import vp10_2 from '../../../../assets/victory-points-10/2.jpg'
import vp10_3 from '../../../../assets/victory-points-10/3.jpg'
import vp10_4 from '../../../../assets/victory-points-10/4.jpg'
import vp10_5 from '../../../../assets/victory-points-10/5.jpg'
import vp10_6 from '../../../../assets/victory-points-10/6.jpg'
import vp10_7 from '../../../../assets/victory-points-10/7.jpg'
import vp10_8 from '../../../../assets/victory-points-10/8.jpg'
import vp10_9 from '../../../../assets/victory-points-10/9.jpg'
import vp10_10 from '../../../../assets/victory-points-10/10.jpg'

import vp14_0 from '../../../../assets/victory-points-14/0.jpg'
import vp14_1 from '../../../../assets/victory-points-14/1.jpg'
import vp14_2 from '../../../../assets/victory-points-14/2.jpg'
import vp14_3 from '../../../../assets/victory-points-14/3.jpg'
import vp14_4 from '../../../../assets/victory-points-14/4.jpg'
import vp14_5 from '../../../../assets/victory-points-14/5.jpg'
import vp14_6 from '../../../../assets/victory-points-14/6.jpg'
import vp14_7 from '../../../../assets/victory-points-14/7.jpg'
import vp14_8 from '../../../../assets/victory-points-14/8.jpg'
import vp14_9 from '../../../../assets/victory-points-14/9.jpg'
import vp14_10 from '../../../../assets/victory-points-14/10.jpg'
import vp14_11 from '../../../../assets/victory-points-14/11.jpg'
import vp14_12 from '../../../../assets/victory-points-14/12.jpg'
import vp14_13 from '../../../../assets/victory-points-14/13.jpg'
import vp14_14 from '../../../../assets/victory-points-14/14.jpg'

import { PointContainer, DraggableFlag } from './draggableIndicators'

const vp10_images = [
  vp10_0,
  vp10_1,
  vp10_2,
  vp10_3,
  vp10_4,
  vp10_5,
  vp10_6,
  vp10_7,
  vp10_8,
  vp10_9,
  vp10_10,
]
const vp14_images = [
  vp14_0,
  vp14_1,
  vp14_2,
  vp14_3,
  vp14_4,
  vp14_5,
  vp14_6,
  vp14_7,
  vp14_8,
  vp14_9,
  vp14_10,
  vp14_11,
  vp14_12,
  vp14_13,
  vp14_14,
]

const useStyles = makeStyles({
  root: {
    width: '75%',
    margin: '0 auto',
    maxHeight: ({ fullscreen }) => (fullscreen ? '19vh' : 'auto'),
    marginBottom: ({ fullscreen }) => (fullscreen ? '1vh' : 0),
  },
  fullWidth: {
    width: '100%',
  },
  defaultPointsContainer: {
    minWidth: 50,
    position: 'relative',
    width: ({ inputWidth }) => `${inputWidth}%`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    fontSize: '2em',
  },
  img: {
    minWidth: 50,
    position: 'relative',
    width: ({ inputWidth }) => `${inputWidth}%`,
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

function VictoryPoints({ editable, target, onChange, points }) {
  const smallViewport = useSmallViewport()
  const { fullscreen } = useFullscreen()
  const pointsToShow = Math.max(target, ...points.map((p) => p.points))
  const inputWidth = 100 / (pointsToShow + 1)
  const classes = useStyles({ inputWidth, fullscreen })
  const vpImages = pointsToShow <= 10 ? vp10_images : vp14_images

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <Grid
        className={clsx(classes.root, {
          [classes.fullWidth]: smallViewport,
        })}
        container
        justifyContent="center"
      >
        {[...Array(pointsToShow + 1).keys()].map((numberOfPoints) => {
          const factionsWithThisManyPoints = points.filter(
            ({ points: factionPoints }) => factionPoints === numberOfPoints,
          )

          return (
            <Grid key={numberOfPoints} className={classes.img} item>
              {vpImages[numberOfPoints] ? (
                <img
                  alt={`${numberOfPoints} victory points background`}
                  src={vpImages[numberOfPoints]}
                />
              ) : (
                <div className={classes.defaultPointsContainer}>
                  <div>{numberOfPoints}</div>
                </div>
              )}
              <Grid
                alignItems="center"
                className={classes.dropContainerWrapper}
                container
                direction="column"
                justifyContent="center"
              >
                <PointContainer
                  className={classes.dropContainer}
                  id={numberOfPoints}
                  points={numberOfPoints}
                >
                  {factionsWithThisManyPoints.map(({ faction }) => (
                    <DraggableFlag
                      key={faction}
                      editable={editable}
                      factionKey={faction}
                      onClick={
                        editable
                          ? () => onChange(faction, numberOfPoints + 1)
                          : undefined
                      }
                      updatePoints={
                        editable
                          ? (factionPoints) => {
                            if (factionPoints === numberOfPoints) {
                              return
                            }

                            onChange(faction, factionPoints)
                          }
                          : undefined
                      }
                    />
                  ))}
                </PointContainer>
              </Grid>
            </Grid>
          )
        })}
      </Grid>
    </DndProvider>
  )
}

export default VictoryPoints
