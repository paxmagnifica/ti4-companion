import { useContext, useState, useMemo } from 'react'
import {
  Dialog,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Highlighter from 'react-highlight-words'
import { useTranslation } from 'react-i18next'

import publicObjectiveI from '../assets/objective-1.png'
import publicObjectiveII from '../assets/objective-2.png'
import secretObjective from '../assets/objective-secret.png'
import reverseObjective from '../assets/objective-1-reverse.jpg'
import { StateContext } from '../state'

const useStyles = makeStyles(theme => ({
  root: {
    maxHeight: '90vh',
    position: 'relative',
    fontSize: ({ fontSize }) => fontSize,
    '& > p': {
      margin: 0,
      width: '100%',
      textAlign: 'center',
      padding: '0 2px',
      wordBreak: 'break-word',
      whiteSpace: 'normal',
      zIndex: 1,
      color: 'white',
    }
  },
  objectiveName: {
    position: 'absolute',
    top: '1%',
    height: '16%',
    fontSize: '.9em',
  },
  phase: {
    position: 'absolute',
    top: '16%',
    height: '8%',
    fontSize: '.8em',
  },
  condition: {
    position: 'absolute',
    top: '30%',
    height: '40%',
    overflow: 'auto',
  },
  points: {
    position: 'absolute',
    top: '74%',
    height: '13%',
    fontSize: '1.5em',
  },
  rewards: {
    position: 'absolute',
    top: '90%',
    fontSize: '.8em',
  },
  objective: {
    width: ({ width }) => width,
    height: ({ height }) => height,
    maxHeight: '90vh',
    pointerEvents: 'none',
    zIndex: 0,
    borderRadius: '5%',
  },
}))

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

const FULLSCREEN_SIZE = {
  width: 'auto',
  height: '26vh',
  fontSize: '1.7vh',
}

const GINORMOUS_SIZE = {
  width: '80vw',
  height: '120vw',
  fontSize: '2em',
}

const getStyles = size => {
  return {
    default: NORMAL_SIZE,
    small: SMALL_SIZE,
    big: GINORMOUS_SIZE,
    fullscreen: FULLSCREEN_SIZE,
  }[size] || NORMAL_SIZE
}

function Objective({
  size,
  title,
  slug,
  reverse,
  className,
  highlight,
  onClick,
}) {
  const { objectives: { data: availableObjectives } } = useContext(StateContext)
  const { secret, points, reward, when } = availableObjectives[slug] || {}
  const styles = getStyles(size)
  const classes = useStyles(styles)
  const { t } = useTranslation()

  const background = useMemo(() => secret
    ? secretObjective
    : points === 1
      ? publicObjectiveI
      : publicObjectiveII, [secret, points])

  const translation = useMemo(() => ({
    name: t(`objectives.${slug}.name`),
    condition: t(`objectives.${slug}.condition`),
  }), [t, slug])

  const renderer = useMemo(() => text => highlight
    ? <Highlighter
      searchWords={highlight}
      autoEscape={true}
      textToHighlight={text}
    />
    : text, [highlight])

  if (reverse) {
    return <div
      className={`${classes.root} ${className || ''}`}
      onClick={onClick}
    >
      <img
        src={reverseObjective}
        className={classes.objective}
        alt={title}
        title={title}
      />
    </div>
  }

  return <div
    className={`${classes.root} ${className || ''}`}
    onClick={onClick}
  >
    <img
      src={background}
      className={classes.objective}
      alt={title || translation.name}
      title={title || translation.name}
    />
    <p className={classes.objectiveName}>
      {renderer(translation.name)}
    </p>
    <p className={classes.phase}>
      {t(`general.phase.${when}`)}
    </p>
    <p className={classes.condition}>
      {renderer(translation.condition)}
    </p>
    <p className={classes.points}>
      {points}
    </p>
    <p className={classes.rewards}>
      {t(`general.reward.${reward}`)}
    </p>
  </div>
}

const useWithModalStyles = makeStyles({
  dialog: {
    '& .MuiPaper-root': {
      backgroundColor: 'transparent',
    }
  },
  clickableObjective: {
    cursor: 'pointer',
  }
})

function ObjectiveWithModal({
  size,
  reverse,
  ...other
}) {
  const classes = useWithModalStyles()
  const [bigObjectiveOpen, setBigObjectiveOpen] = useState(false)

  if (reverse || size !== 'small') {
    return <>
      <Objective
        reverse={reverse}
        size={size}
        {...other}
      />
    </>
  }

  return <>
    <Objective
      reverse={reverse}
      className={classes.clickableObjective}
      size={size}
      onClick={() => setBigObjectiveOpen(true)}
      {...other}
    />
    <Dialog
      className={classes.dialog}
      open={bigObjectiveOpen}
      onClose={() => setBigObjectiveOpen(false)}
    >
      <Objective
        size='big'
        {...other}
      />
    </Dialog>
  </>
}

export default ObjectiveWithModal
