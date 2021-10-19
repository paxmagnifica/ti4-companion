import { useState, useMemo } from 'react'
import { Dialog } from '@material-ui/core'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Highlighter from 'react-highlight-words'
import { useTranslation } from 'react-i18next'

import culturalSprite from '../../assets/exploration-blue-sprite.jpg'
import hazardousSprite from '../../assets/exploration-red-sprite.jpg'
import industrialSprite from '../../assets/exploration-green-sprite.jpg'
import frontierSprite from '../../assets/exploration-frontier-sprite.jpg'

export const PLANET_TYPE = {
  cultural: 0,
  industrial: 1,
  hazardous: 2,
  frontier: 3,
}

const TECHNOLOGY = {
  biotic: 0,
  propulsion: 1,
  cybernetic: 2,
  warfare: 3,
}

const useStyles = makeStyles({
  root: {
    backgroundImage: ({ background }) => `url(${background})`,
    backgroundSize: 'auto 100%',
    width: ({ width }) => width,
    height: ({ height }) => height,
    fontSize: ({ fontSize }) => fontSize,
    borderRadius: '4%',
    position: 'relative',
    '& p': {
      margin: 0,
      padding: 0,
      textAlign: 'center',
      whiteSpace: 'normal',
      lineHeight: 1.5,
      fontSize: '0.9em',
    },
  },
  number: {
    marginTop: 0,
    textAlign: 'center',
    fontSize: ({ fontSize }) => fontSize,
  },
  mask: {
    backgroundColor: '#06050b',
    position: 'absolute',
  },
  titleMask: {
    top: '3%',
    width: '77%',
    left: '11%',
    height: '13%',
    display: 'flex',
    direction: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '&.techSkip': {
      top: '22%',
      left: '5%',
      width: '90%',
    },
  },
  effectMask: {
    top: '24%',
    width: '80%',
    left: '10%',
    height: '70%',
    '& p': {
      height: '100%',
      overflow: 'auto',
    },
    '&.relic': {
      top: '60%',
      height: '33%',
    },
    '&.attachment': {
      height: '52%',
    },
    '&.techSkip': {
      top: '39%',
      height: '39%',
    },
  },
  resourcesMask: {
    left: '16%',
    top: '86%',
    width: '9%',
    height: '7%',
    display: 'flex',
    direction: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  influenceMask: {
    left: '81%',
    top: '86%',
    width: '9%',
    height: '7%',
    display: 'flex',
    direction: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const SPRITES = {
  [PLANET_TYPE.cultural]: culturalSprite,
  [PLANET_TYPE.hazardous]: hazardousSprite,
  [PLANET_TYPE.industrial]: industrialSprite,
  [PLANET_TYPE.frontier]: frontierSprite,
}

const SMALL_SIZE = {
  width: 100,
  height: 150,
  fontSize: '.6em',
}

const NORMAL_SIZE = {
  width: 150,
  height: 225,
  fontSize: '1em',
}

const GINORMOUS_SIZE = {
  width: '80vw',
  height: '120vw',
  fontSize: '2em',
}

function ExplorationCard({
  attachment,
  influence,
  numberOfCards,
  relic,
  resources,
  slug,
  techSkip,
  planetType,
  small,
  big,
  onClick,
  className,
  highlight,
}) {
  const stylesInit = small ? SMALL_SIZE : big ? GINORMOUS_SIZE : NORMAL_SIZE
  const background = SPRITES[planetType]
  const classes = useStyles({ background, ...stylesInit })
  const { t } = useTranslation()

  const styles = useMemo(() => {
    if (relic) {
      return {
        backgroundPosition: '-100% 0',
      }
    }

    if (
      planetType === PLANET_TYPE.industrial &&
      techSkip === TECHNOLOGY.propulsion
    ) {
      return {
        backgroundPosition: '-200% 0',
      }
    }

    if (
      planetType === PLANET_TYPE.industrial &&
      techSkip === TECHNOLOGY.biotic
    ) {
      return {
        backgroundPosition: '-300% 0',
      }
    }

    if (
      planetType === PLANET_TYPE.industrial &&
      techSkip === TECHNOLOGY.cybernetic
    ) {
      return {
        backgroundPosition: '-400% 0',
      }
    }

    if (techSkip || techSkip === 0) {
      return {
        backgroundPosition: '-300% 0',
      }
    }

    if (attachment) {
      return {
        backgroundPosition: '-200% 0',
      }
    }

    return {}
  }, [relic, attachment, techSkip, planetType])

  const textRenderer = useMemo(
    () => (text) =>
      highlight ? (
        <Highlighter
          autoEscape
          searchWords={highlight}
          textToHighlight={text}
        />
      ) : (
        text
      ),
    [highlight],
  )

  const { title, effect } = useMemo(
    () => ({
      title: t(`explorationCards.${slug}.title`),
      effect: t(`explorationCards.${slug}.effect`),
    }),
    [t, slug],
  )

  return (
    <>
      <div
        className={clsx(className, classes.root)}
        onClick={onClick}
        style={styles}
      >
        <div
          className={clsx(classes.mask, classes.titleMask, {
            techSkip: techSkip || techSkip === 0,
          })}
        >
          <p>{textRenderer(title)}</p>
        </div>
        <div
          className={clsx(classes.mask, classes.effectMask, {
            relic,
            attachment,
            techSkip: techSkip || techSkip === 0,
          })}
        >
          <p>{textRenderer(effect)}</p>
        </div>
        {attachment && (
          <div className={clsx(classes.mask, classes.resourcesMask)}>
            <p>{resources}</p>
          </div>
        )}
        {attachment && (
          <div className={clsx(classes.mask, classes.influenceMask)}>
            <p>{influence}</p>
          </div>
        )}
      </div>
      <p className={classes.number}>
        <strong>{numberOfCards}</strong> in deck
      </p>
    </>
  )
}

const useWithModalStyles = makeStyles({
  dialog: {
    '& .MuiPaper-root': {
      backgroundColor: 'transparent',
    },
  },
  clickable: {
    cursor: 'pointer',
  },
})

function ExplorationCardWithModal({ small, ...other }) {
  const classes = useWithModalStyles()
  const [bigOpen, setBigOpen] = useState(false)

  if (!small) {
    return (
      <>
        <ExplorationCard small={small} {...other} />
      </>
    )
  }

  return (
    <>
      <ExplorationCard
        className={classes.clickable}
        onClick={() => setBigOpen(true)}
        small={small}
        {...other}
      />
      <Dialog
        className={classes.dialog}
        onClose={() => setBigOpen(false)}
        open={bigOpen}
      >
        <ExplorationCard big {...other} />
      </Dialog>
    </>
  )
}

export default ExplorationCardWithModal
