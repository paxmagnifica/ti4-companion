import { useContext, useState, useMemo } from 'react'
import {
  Dialog,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Highlighter from 'react-highlight-words'

import publicObjectiveI from '../assets/objective-1.png'
import publicObjectiveII from '../assets/objective-2.png'
import secretObjective from '../assets/objective-secret.png'
import reverseObjective from '../assets/objective-1-reverse.jpg'
import translations from '../i18n/index'
import { StateContext } from '../state'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: ({ width }) => width,
    height: ({ height }) => height,
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
    height: '16%',
  },
  phase: {
    height: '8%',
    fontSize: '.9em',
  },
  condition: {
    marginTop: '13% !important',
    height: '40%',
  },
  points: {
    marginTop: '5% !important',
    height: '13%',
    fontSize: '1.5em',
  },
  reward: {
    marginTop: '3% !important',
    fontSize: '.9em',
  },
  objective: {
    position: 'absolute',
    width: ({ width }) => width,
    height: ({ height }) => height,
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

const GINORMOUS_SIZE = {
  width: '80vw',
  height: '120vw',
  fontSize: '2em',
}

function Objective({
  title,
  slug,
  reverse,
  small,
  big,
  className,
  highlight,
  ...other
}) {
  const { objectives: { data: availableObjectives } } = useContext(StateContext)
  const { secret, points, reward, when } = availableObjectives[slug] || {}
  const styles = small
      ? SMALL_SIZE
      : big
        ? GINORMOUS_SIZE
        : NORMAL_SIZE
  const classes = useStyles(styles)

  const background = useMemo(() => secret
    ? secretObjective
    : points === 1
      ? publicObjectiveI
      : publicObjectiveII, [secret, points])

  const translation = useMemo(() => translations.objectivesDictionary[slug], [slug])

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
      {...other}
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
    {...other}
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
      {translations.general.phase[when]}
    </p>
    <p className={classes.condition}>
      {renderer(translation.condition)}
    </p>
    <p className={classes.points}>
      {points}
    </p>
    <p className={classes.rewards}>
      {translations.general.reward[reward]}
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
  small,
  reverse,
  ...other
}) {
  const classes = useWithModalStyles()
  const [bigObjectiveOpen, setBigObjectiveOpen] = useState(false)

  if (reverse || !small) {
    return <>
      <Objective
        reverse={reverse}
        small={small}
        {...other}
      />
    </>
  }

  return <>
    <Objective
      reverse={reverse}
      className={classes.clickableObjective}
      small={small}
      onClick={() => setBigObjectiveOpen(true)}
      {...other}
    />
    <Dialog
      className={classes.dialog}
      open={bigObjectiveOpen}
      onClose={() => setBigObjectiveOpen(false)}
    >
      <Objective
        big={true}
        {...other}
      />
    </Dialog>
  </>

}

export default ObjectiveWithModal
