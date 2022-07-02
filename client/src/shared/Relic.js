import { useState, useMemo } from 'react'
import { Dialog } from '@material-ui/core'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Highlighter from 'react-highlight-words'

import { useTranslation } from '../i18n'
import sprite from '../assets/relic-sprite.jpg'

const useStyles = makeStyles({
  root: {
    backgroundImage: `url(${sprite})`,
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
  },
})

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

function Relic({ slug, small, big, onClick, className, highlight }) {
  const { t } = useTranslation()
  let stylesInit = NORMAL_SIZE
  if (small) {
    stylesInit = SMALL_SIZE
  } else if (big) {
    stylesInit = GINORMOUS_SIZE
  }
  const background = sprite
  const classes = useStyles({ background, ...stylesInit })

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
      title: t(`relics.${slug}.title`),
      effect: t(`relics.${slug}.effect`),
    }),
    [slug, t],
  )

  return (
    <div className={clsx(className, classes.root)} onClick={onClick}>
      <div className={clsx(classes.mask, classes.titleMask)}>
        <p>{textRenderer(title)}</p>
      </div>
      <div className={clsx(classes.mask, classes.effectMask)}>
        <p>{textRenderer(effect)}</p>
      </div>
    </div>
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

function RelicWithModal({ small, ...other }) {
  const classes = useWithModalStyles()
  const [bigOpen, setBigOpen] = useState(false)

  if (!small) {
    return (
      <>
        <Relic small={small} {...other} />
      </>
    )
  }

  return (
    <>
      <Relic
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
        <Relic big {...other} />
      </Dialog>
    </>
  )
}

export default RelicWithModal
