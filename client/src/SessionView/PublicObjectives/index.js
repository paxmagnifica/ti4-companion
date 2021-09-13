import { useCallback, useMemo, useState, useContext } from 'react'
import {
  Grid,
  IconButton,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { DispatchContext } from '../../state'
import FactionFlag from '../../FactionFlag'

import Objective from './Objective'
import AddObjective from './AddObjective'

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
    {factions.map(factionKey => <FactionFlag
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
  updateFactionPoints,
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
    const factionPoints = session.points.find(({faction}) => faction === change.factionKey)?.points;

    if (change.event === 'selected') {
      updateFactionPoints({ sessionId: session.id, faction: change.factionKey, points: factionPoints + 1 })
      dispatch({ type: 'objectiveScored', payload: { sessionId: session.id, slug: objective.slug, faction: change.factionKey } })
    } else {
      updateFactionPoints({ sessionId: session.id, faction: change.factionKey, points: factionPoints - 1 })
      dispatch({ type: 'objectiveDescored', payload: { sessionId: session.id, slug: objective.slug, faction: change.factionKey } })
    }
  }, [dispatch, session.id, session.points, updateFactionPoints])

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
