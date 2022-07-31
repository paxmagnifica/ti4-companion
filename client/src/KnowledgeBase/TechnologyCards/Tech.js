import { useState, useMemo } from 'react'
import { Dialog } from '@material-ui/core'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Highlighter from 'react-highlight-words'

import { useTranslation } from '../../i18n'
import maskBackground from '../../assets/tech-front-background.png'
import front from '../../assets/tech-front.png'

import { TechType, TechLevel } from './TechnologyMeta'

const useStyles = makeStyles({
  root: {
    backgroundImage: `url(${front})`,
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
    backgroundImage: `url(${maskBackground})`,
    position: 'absolute',
  },
  titleMask: {
    top: '1%',
    height: '12%',
    left: '5%',
    width: '90%',
    display: 'flex',
    direction: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  effectMask: {
    top: '16%',
    width: '80%',
    left: '15%',
    height: '54%',
    '& p': {
      height: '100%',
      overflow: 'auto',
    },
  },
  techType: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '18.5%',
    height: '28%',
  },
  techLevel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '11.5%',
    height: '61%',
  },
})

const SMALL_SIZE = {
  height: 100,
  width: 150,
  fontSize: '.6em',
}

const NORMAL_SIZE = {
  height: 150,
  width: 225,
  fontSize: '1em',
}

const GINORMOUS_SIZE = {
  height: '80vw',
  width: '120vw',
  fontSize: '2em',
}

function TechComponent({
  type,
  level,
  slug,
  small,
  big,
  onClick,
  className,
  highlight,
}) {
  const { t } = useTranslation()
  let stylesInit = NORMAL_SIZE
  if (small) {
    stylesInit = SMALL_SIZE
  } else if (big) {
    stylesInit = GINORMOUS_SIZE
  }
  const classes = useStyles(stylesInit)

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
      title: t(`techs.${slug}.title`),
      effect: t(`techs.${slug}.effect`),
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
      <TechType className={classes.techType} type={type} />
      <TechLevel className={classes.techLevel} level={level} type={type} />
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

export function Tech({ small, ...other }) {
  const classes = useWithModalStyles()
  const [bigOpen, setBigOpen] = useState(false)

  if (!small) {
    return (
      <>
        <TechComponent small={small} {...other} />
      </>
    )
  }

  return (
    <>
      <TechComponent
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
        <TechComponent big {...other} />
      </Dialog>
    </>
  )
}
