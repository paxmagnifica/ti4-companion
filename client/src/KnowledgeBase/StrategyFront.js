import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

import { useTranslation } from '../i18n'
import { images } from '../GameComponents/gameInfo/strategyCards'

const referenceWidth = 805
const referenceHeight = 1000
const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    width: ({ width }) => width,
    height: ({ height }) => height,
    fontSize: ({ fontScale }) => `${fontScale}rem`,
    overflow: 'hidden',
    '& > img': {
      width: ({ width, height }) => Math.max(width, height),
      height: ({ width, height }) => Math.max(width, height),
    },
  },
  mask: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
  },
  right: {
    top: 0,
    bottom: 0,
    left: `${(650 / referenceWidth) * 100}%`,
    width: `${(400 / referenceWidth) * 100}%`,
    transform: 'skewX(-21deg)',
  },
  topRight: {
    top: 0,
    left: `${(766 / referenceWidth) * 100}%`,
    height: `${(112 / referenceHeight) * 100}%`,
    width: `${(100 / referenceWidth) * 100}%`,
    transform: 'skewX(33deg)',
  },
  left: {
    left: 0,
    top: 0,
    bottom: 0,
    width: `${(27 / referenceWidth) * 100}%`,
  },
  topLeft: {
    left: 0,
    top: `${(-16 / referenceHeight) * 100}%`,
    width: `${(48 / referenceWidth) * 100}%`,
    height: `${(65 / referenceHeight) * 100}%`,
    transform: 'skewX(-46deg)',
  },
  top: {
    left: 0,
    right: 0,
    top: 0,
    height: `${(16 / referenceHeight) * 100}%`,
  },
  bottom: {
    left: 0,
    right: 0,
    bottom: 0,
    height: `${(16 / referenceHeight) * 100}%`,
  },
  card: {
    // backgroundColor: 'yellow',
    backgroundColor: '#231f20',
  },
  name1: {
    display: 'none',
    top: `${(43 / referenceHeight) * 100}%`,
    left: `${(77 / referenceWidth) * 100}%`,
    width: `${(386 / referenceWidth) * 100}%`,
    height: `${(50 / referenceHeight) * 100}%`,
    '&.construction': {
      width: `${(473 / referenceWidth) * 100}%`,
    },
    '&.technology': {
      width: `${(405 / referenceWidth) * 100}%`,
    },
  },
  primary1: {
    top: `${(286 / referenceHeight) * 100}%`,
    left: `${(135 / referenceWidth) * 100}%`,
    width: `${(489 / referenceWidth) * 100}%`,
    height: `${(259 / referenceHeight) * 100}%`,
    transform: 'skewX(-22deg)',
    '&.politics': {
      left: `${(142 / referenceWidth) * 100}%`,
      width: `${(457 / referenceWidth) * 100}%`,
      height: `${(328 / referenceHeight) * 100}%`,
    },
    '&.construction': {
      height: `${(225 / referenceHeight) * 100}%`,
    },
    '&.trade': {
      height: `${(270 / referenceHeight) * 100}%`,
      width: `${(496 / referenceWidth) * 100}%`,
    },
    '&.imperial': {
      top: `${(265 / referenceHeight) * 100}%`,
      height: `${(280 / referenceHeight) * 100}%`,
    },
  },
  primary2: {
    top: `${(195 / referenceHeight) * 100}%`,
    left: `${(127 / referenceWidth) * 100}%`,
    width: `${(505 / referenceWidth) * 100}%`,
    height: `${(93 / referenceHeight) * 100}%`,
    transform: 'skewX(36deg)',
    '&.warfare': {
      top: `${(227 / referenceHeight) * 100}%`,
      width: `${(549 / referenceWidth) * 100}%`,
      height: `${(59 / referenceHeight) * 100}%`,
    },
    '&.imperial': {
      top: `${(227 / referenceHeight) * 100}%`,
      width: `${(570 / referenceWidth) * 100}%`,
      height: `${(38 / referenceHeight) * 100}%`,
    },
  },
  primary3: {
    height: `${(350 / referenceHeight) * 100}%`,
    top: `${(195 / referenceHeight) * 100}%`,
    left: `${(76 / referenceWidth) * 100}%`,
    width: `${(111 / referenceWidth) * 100}%`,
    '&.politics': {
      height: `${(418 / referenceHeight) * 100}%`,
      width: `${(131 / referenceWidth) * 100}%`,
    },
    '&.construction': {
      height: `${(316 / referenceHeight) * 100}%`,
    },
    '&.imperial': {
      top: `${(227 / referenceHeight) * 100}%`,
      width: `${(115 / referenceWidth) * 100}%`,
      height: `${(318 / referenceHeight) * 100}%`,
    },
  },
  secondary1: {
    left: `${(147 / referenceWidth) * 100}%`,
    top: `${(671 / referenceHeight) * 100}%`,
    width: `${(350 / referenceWidth) * 100}%`,
    height: `${(278 / referenceHeight) * 100}%`,
    transform: 'skewX(-21deg)',
    '&.construction': {
      top: `${(640 / referenceHeight) * 100}%`,
      height: `${(310 / referenceHeight) * 100}%`,
    },
    '&.politics': {
      top: `${(710 / referenceHeight) * 100}%`,
      width: `${(340 / referenceWidth) * 100}%`,
      height: `${(238 / referenceHeight) * 100}%`,
    },
  },
  secondary2: {
    top: `${(671 / referenceHeight) * 100}%`,
    left: `${(77 / referenceWidth) * 100}%`,
    width: `${(126 / referenceWidth) * 100}%`,
    height: `${(261 / referenceHeight) * 100}%`,
    '&.construction': {
      top: `${(640 / referenceHeight) * 100}%`,
      height: `${(300 / referenceHeight) * 100}%`,
    },
    '&.politics': {
      top: `${(710 / referenceHeight) * 100}%`,
      height: `${(230 / referenceHeight) * 100}%`,
    },
  },
  primaryAbility: {
    position: 'absolute',
    margin: 0,
    padding: 0,
    whiteSpace: 'normal',
    lineHeight: 2,
    fontSize: '2em',
    top: `${(200 / referenceHeight) * 100}%`,
    left: `${(107 / referenceWidth) * 100}%`,
    width: `${(500 / referenceWidth) * 100}%`,
    height: `${(300 / referenceHeight) * 100}%`,
  },
  secondaryAbility: {
    position: 'absolute',
    padding: 0,
    margin: 0,
    whiteSpace: 'normal',
    lineHeight: 2,
    fontSize: '2em',
    top: `${(674 / referenceHeight) * 100}%`,
    left: `${(107 / referenceWidth) * 100}%`,
    width: `${(340 / referenceWidth) * 100}%`,
    height: `${(275 / referenceHeight) * 100}%`,
    '&.politics': {
      top: `${(710 / referenceHeight) * 100}%`,
      height: `${(230 / referenceHeight) * 100}%`,
    },
    '&.construction': {
      top: `${(625 / referenceHeight) * 100}%`,
      height: `${(310 / referenceHeight) * 100}%`,
    },
    '&.warfare': {
      fontSize: '1.7em',
    },
  },
}))

function StrategyFront({ strategy, small }) {
  const { t } = useTranslation()

  // TODO this is all total magic, btw
  // and we should've just used cropped images (which we will use in the future, I wanted to have some fun)
  const height = small ? 400 : 550
  const fontScale = small ? 225 / (1.6 * height) : 225 / (0.85 * height)
  const actualHeight = height || 225
  const actualWidth = (height * 181) / 225
  const classes = useStyles({
    width: actualWidth,
    height: actualHeight,
    fontScale,
  })

  const img = images[strategy]

  return (
    <div className={classes.container}>
      <div className={clsx(classes.mask, classes.topLeft, strategy)} />
      <div className={clsx(classes.mask, classes.left, strategy)} />
      <div className={clsx(classes.mask, classes.top, strategy)} />
      <div className={clsx(classes.mask, classes.bottom, strategy)} />
      <div className={clsx(classes.mask, classes.right, strategy)} />
      <div className={clsx(classes.mask, classes.right2, strategy)} />
      <div className={clsx(classes.mask, classes.topRight, strategy)} />
      <div
        className={clsx(classes.mask, classes.card, classes.name1, strategy)}
      />
      <div
        className={clsx(classes.mask, classes.card, classes.primary1, strategy)}
      />
      <div
        className={clsx(classes.mask, classes.card, classes.primary2, strategy)}
      />
      <div
        className={clsx(classes.mask, classes.card, classes.primary3, strategy)}
      />
      <div
        className={clsx(
          classes.mask,
          classes.card,
          classes.secondary1,
          strategy,
        )}
      />
      <div
        className={clsx(
          classes.mask,
          classes.card,
          classes.secondary2,
          strategy,
        )}
      />
      <ul className={clsx(classes.primaryAbility, strategy)}>
        {t(`strategyCards.${strategy}.primary`)
          .split('\n')
          .map((l) => (
            <li key={l}>{l}</li>
          ))}
      </ul>
      <ul className={clsx(classes.secondaryAbility, strategy)}>
        {t(`strategyCards.${strategy}.secondary`)
          .split('\n')
          .map((l) => (
            <li key={l}>{l}</li>
          ))}
      </ul>
      <img alt={strategy} src={img} title={strategy} />
    </div>
  )
}

export default StrategyFront
