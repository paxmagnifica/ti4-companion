import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

import { images } from '../gameInfo/strategyCards'

const referenceWidth = 358
const referenceHeight = 450
const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    width: ({ width }) => width,
    height: ({ height }) => height,
    overflow: 'hidden',
    '& > img': {
      position: 'absolute',
      left: `${(-634 / referenceWidth) * 100}%`,
      top: `${(-525 / referenceHeight) * 100}%`,
      width: ({ width }) => (1000 * width) / referenceWidth,
      height: ({ height }) => (1000 * height) / referenceHeight,
      zIndex: 1,
    },
  },
  mask: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    zIndex: 2,
  },
  bottomLeft: {
    bottom: 0,
    left: `${(-84 / referenceWidth) * 100}%`,
    width: `${(161 / referenceWidth) * 100}%`,
    height: `${(410 / referenceHeight) * 100}%`,
    transform: 'skewX(21deg)',
  },
  topLeft: {
    top: 0,
    left: `${(-18 / referenceWidth) * 100}%`,
    width: `${(34 / referenceWidth) * 100}%`,
    height: `${(49 / referenceHeight) * 100}%`,
    transform: 'skewX(-36deg)',
  },
}))

function StrategyBack({ strategy, height, ...others }) {
  const actualHeight = height || 225
  const actualWidth = (height * 179) / 225
  const classes = useStyles({ width: actualWidth, height: actualHeight })

  const img = images[strategy]

  return (
    <div className={classes.container} {...others}>
      <div className={clsx(classes.mask, classes.bottomLeft)} />
      <div className={clsx(classes.mask, classes.topLeft)} />
      <img alt={strategy} src={img} title={strategy} {...others} />
    </div>
  )
}

export default StrategyBack
