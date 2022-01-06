import { useState, useMemo } from 'react'
import { Dialog } from '@material-ui/core'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Highlighter from 'react-highlight-words'
import { useTranslation } from 'react-i18next'

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
    position: 'absolute',
  },
  titleMask: {
    backgroundColor: ({ titleMaskColor }) => titleMaskColor || '#06050b',
    top: '3%',
    width: '82%',
    left: '9%',
    height: '13%',
    display: 'flex',
    direction: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  effectMask: {
    backgroundColor: ({ effectMaskColor }) => effectMaskColor || '#06050b',
    color: ({ effectColor }) => effectColor || 'white',
    top: '26.5%',
    height: '69.5%',
    width: '88%',
    left: '6%',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
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

function CardComponent({
  background,
  slug,
  small,
  big,
  onClick,
  className,
  highlight,
  translationNamespace,
  effectMaskColor,
  effectColor,
  titleMaskColor,
  fillBottom,
}) {
  const { t } = useTranslation()
  let stylesInit = NORMAL_SIZE
  if (small) {
    stylesInit = SMALL_SIZE
  } else if (big) {
    stylesInit = GINORMOUS_SIZE
  }
  const titleMaskBackground = titleMaskColor || '#06050b'
  const classes = useStyles({
    background,
    titleMaskColor: titleMaskBackground,
    effectColor,
    effectMaskColor,
    ...stylesInit,
  })

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
      title: t(`${translationNamespace}.${slug}.title`),
      effect: t(`${translationNamespace}.${slug}.effect`),
    }),
    [translationNamespace, slug, t],
  )

  return (
    <div className={clsx(className, classes.root)} onClick={onClick}>
      <div className={clsx(classes.mask, classes.titleMask)}>
        <p>{textRenderer(title)}</p>
      </div>
      <div className={clsx(classes.mask, classes.effectMask)}>
        <p>{textRenderer(effect)}</p>
      </div>
      <div
        style={{
          backgroundColor: titleMaskBackground,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: fillBottom,
        }}
      />
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

export function Card({ small, ...other }) {
  const classes = useWithModalStyles()
  const [bigOpen, setBigOpen] = useState(false)

  if (!small) {
    return (
      <>
        <CardComponent small={small} {...other} />
      </>
    )
  }

  return (
    <>
      <CardComponent
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
        <CardComponent big {...other} />
      </Dialog>
    </>
  )
}
