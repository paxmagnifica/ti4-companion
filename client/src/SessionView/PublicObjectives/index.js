import { useCallback, useMemo, useState, useContext } from 'react'
import {
  Grid,
  IconButton,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { DispatchContext } from '../../state'
import * as factions from '../../gameInfo/factions'

import Objective from './Objective'
import AddObjective from './AddObjective'

const useFlagStyles = makeStyles({
  root: {
    width: ({ width }) => width,
    backgroundColor: ({ selected }) => `rgba(255, 255, 255, ${selected ? '1' : '0.3'})`,
    borderRadius: '4%',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      '& img': {
        opacity: '1 !important',
      }
    },
    display: 'flex',
    justifyContent: 'center',
  },
  factionImage: {
    opacity: ({ selected }) => selected ? 1 : 0.5,
    height: ({ height }) => height,
    width: 'auto',
    backgroundSize: 'contain',
    backgroundRepeat: 'none',
  }
})

// TODO duplication in VictoryPoints
function Flag({
  factionKey,
  selected,
  onClick,
  width,
  height,
}) {
  const classes = useFlagStyles({
    selected,
    width,
    height,
  })
  const factionData = factions.getData(factionKey)

  return <div className={classes.root}>
    <img
      className={classes.factionImage}
      onClick={onClick}
      src={factionData.image}
      alt={factionKey}
      title={factionData.name}
    />
  </div>
}

const useSelectorStyles = makeStyles({
  root: {
    display: 'flex',
  }
})

function FactionSelector({
  factions,
  value,
  onChange,
}) {
  const classes = useSelectorStyles()

  const clicked = useCallback((factionKey, selected) => {
    if (selected) {
      onChange({ factionKey, event: 'selected' })
      return
    }

    onChange({ factionKey, event: 'deselected' })
    return
  }, [onChange])

  return <div className={classes.root}>
    {factions.map(factionKey => <Flag
      width='25%'
      height='2em'
      key={factionKey}
      factionKey={factionKey}
      selected={value.includes(factionKey)}
      onClick={() => clicked(factionKey, !value.includes(factionKey))}
    />)}
  </div>
}

const useStyles = makeStyles({
  objectiveContainer: {
    padding: 0,
    margin: 12,
    display: 'flex',
    flexDirection: 'column',
  }
})

function PublicObjectives({
  session,
}) {
  const classes = useStyles()
  const dispatch = useContext(DispatchContext)
  const sessionObjectives = useMemo(() => session.objectives || [], [session])
  const [addObjectiveOpen, setAddObjectiveOpen] = useState(false)

  const objectiveAdded = useCallback(objective => {
    dispatch({ type: 'objectiveAdded', payload: { sessionId: session.id, slug: objective.slug } })
    setAddObjectiveOpen(false)
  }, [dispatch, session.id])

  const objectiveScored = useCallback(({ change, objective }) => {
    if (change.event === 'selected') {
      dispatch({ type: 'objectiveScored', payload: { sessionId: session.id, slug: objective.slug, faction: change.factionKey } })
    } else {
      dispatch({ type: 'objectiveDescored', payload: { sessionId: session.id, slug: objective.slug, faction: change.factionKey } })
    }
  }, [dispatch, session.id])

  return <>
    <Grid container justifyContent='center'>
      {sessionObjectives.map(sessionObjective => <div
        className={classes.objectiveContainer}
        key={sessionObjective.slug}
      >
        <Objective
          {...sessionObjective}
        />
        <FactionSelector
          factions={session.factions}
          value={sessionObjective.scoredBy}
          onChange={change => objectiveScored({ change, objective: sessionObjective })}
        />
      </div>)}
      <div className={classes.objectiveContainer}>
        <IconButton
          onClick={() => setAddObjectiveOpen(true)}
          style={{ padding: 0, margin: 0 }}
        >
          <Objective
            reverse
            title='new Stage I objective'
          />
        </IconButton>
      </div>
    </Grid>
    <AddObjective
      open={addObjectiveOpen}
      onCancel={() => setAddObjectiveOpen(false)}
      onSelect={objectiveAdded}
    />
  </>
}

export default PublicObjectives
