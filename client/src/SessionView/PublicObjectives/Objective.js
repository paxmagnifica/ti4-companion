import { useContext, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import publicObjectiveI from '../../assets/objective-1.png'
import publicObjectiveII from '../../assets/objective-2.png'
import secretObjective from '../../assets/objective-secret.png'
import reverseObjective from '../../assets/objective-1-reverse.jpg'
import translations from '../../i18n/index'
import { StateContext } from '../../state'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: 150,
    height: 225,
    position: 'relative',
    '& > p': {
      margin: 0,
      textAlign: 'center',
      padding: '0 2px',
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
    width: 150,
    height: 225,
    pointerEvents: 'none',
    zIndex: 0,
    borderRadius: '5%',
  },
}))

function Objective({
  title,
  slug,
  reverse,
  ...other
}) {
  const { objectives: { data: availableObjectives } } = useContext(StateContext)
  const { secret, points, reward, when } = availableObjectives[slug] || {}
  const classes = useStyles()

  const background = useMemo(() => secret
    ? secretObjective
    : points === 1
      ? publicObjectiveI
      : publicObjectiveII, [secret, points])

  const translation = useMemo(() => translations.objectivesDictionary[slug], [slug])

  if (reverse) {
    return <div
      className={classes.root}
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
    className={classes.root}
    {...other}
  >
    <img
      src={background}
      className={classes.objective}
      alt={title || translation.name}
      title={title || translation.name}
    />
    <p className={classes.objectiveName}>
      {translation.name}
    </p>
    <p className={classes.phase}>
      {translations.general.phase[when]}
    </p>
    <p className={classes.condition}>
      {translation.condition}
    </p>
    <p className={classes.points}>
      {points}
    </p>
    <p className={classes.rewards}>
      {translations.general.reward[reward]}
    </p>
  </div>
}

export default Objective
