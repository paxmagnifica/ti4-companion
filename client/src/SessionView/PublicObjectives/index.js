import { useCallback, useMemo, useState, useContext } from 'react'
import {
  Grid,
  IconButton,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import useSmallViewport from '../../shared/useSmallViewport'
import { ComboDispatchContext } from '../../state'
import Objective from '../../shared/Objective'

import AddObjective from './AddObjective'
import ObjectiveWithFactionSelector from './ObjectiveWithFactionSelector'

const useStyles = makeStyles({
  objectiveContainer: {
    padding: 0,
    margin: ({ small }) => small ? 6 : 12,
    display: 'flex',
    flexDirection: 'column',
  }
})

function PublicObjectives({
  session,
  updateFactionPoints,
}) {
  const smallViewport = useSmallViewport()
  const classes = useStyles({ small: smallViewport })
  const comboDispatch = useContext(ComboDispatchContext)
  const sessionObjectives = useMemo(() => session.objectives || [], [session])
  const [addObjectiveOpen, setAddObjectiveOpen] = useState(false)

  const objectiveAdded = useCallback(objective => {
    comboDispatch({ type: 'ObjectiveAdded', payload: { sessionId: session.id, slug: objective.slug } })
    setAddObjectiveOpen(false)
  }, [comboDispatch, session.id])

  const objectiveScored = useCallback(({ change, objective }) => {
    const factionPoints = session.points.find(({faction}) => faction === change.factionKey)?.points;

    if (change.event === 'selected') {
      updateFactionPoints({ sessionId: session.id, faction: change.factionKey, points: factionPoints + 1 })
      comboDispatch({ type: 'ObjectiveScored', payload: { sessionId: session.id, slug: objective.slug, faction: change.factionKey } })
    } else {
      updateFactionPoints({ sessionId: session.id, faction: change.factionKey, points: factionPoints - 1 })
      comboDispatch({ type: 'ObjectiveDescored', payload: { sessionId: session.id, slug: objective.slug, faction: change.factionKey } })
    }
  }, [comboDispatch, session.id, session.points, updateFactionPoints])

  return <>
    <Grid container justifyContent='center'>
      {sessionObjectives.map(sessionObjective => <div
        className={classes.objectiveContainer}
        key={sessionObjective.slug}
      >
        <ObjectiveWithFactionSelector
          small={smallViewport}
          objective={sessionObjective}
          selector={{
            factions: session.factions,
            value: sessionObjective.scoredBy,
            onChange: change => objectiveScored({ change, objective: sessionObjective }),
          }}
        />
      </div>)}
      <div className={classes.objectiveContainer}>
        <IconButton
          onClick={() => setAddObjectiveOpen(true)}
          style={{ padding: 0, margin: 0 }}
        >
          <Objective
            small={smallViewport}
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
