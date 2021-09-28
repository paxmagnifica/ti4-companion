import { useCallback, useMemo, useState, useContext } from 'react'
import clsx from 'clsx'
import {
  Grid,
  IconButton,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import useSmallViewport from '../../../shared/useSmallViewport'
import { StateContext, ComboDispatchContext } from '../../../state'
import Objective from '../../../shared/Objective'

import AddObjective from './AddObjective'
import ObjectiveWithFactionSelector from './ObjectiveWithFactionSelector'

const useStyles = makeStyles({
  objectiveContainer: {
    padding: 0,
    margin: ({ small }) => small ? 6 : 12,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 150,
  },
  small: {
    width: 'unset',
  }
})

function PublicObjectives({
  session,
  updateFactionPoints,
}) {
  const smallViewport = useSmallViewport()
  const classes = useStyles({ small: smallViewport })
  const comboDispatch = useContext(ComboDispatchContext)
  const { objectives: { data: availableObjectives } } = useContext(StateContext)
  const sessionObjectives = useMemo(() => session.objectives || [], [session])
  const [addObjectiveOpen, setAddObjectiveOpen] = useState(false)

  const objectiveAdded = useCallback(objective => {
    comboDispatch({ type: 'ObjectiveAdded', payload: { sessionId: session.id, slug: objective.slug } })
    setAddObjectiveOpen(false)
  }, [comboDispatch, session.id])

  const objectiveScored = useCallback(({ change, objective }) => {
    const factionPoints = session.points.find(({faction}) => faction === change.factionKey)?.points;
    const objectivePoints = availableObjectives[objective.slug].points

    if (change.event === 'selected') {
      updateFactionPoints({ sessionId: session.id, faction: change.factionKey, points: factionPoints + objectivePoints })
      comboDispatch({ type: 'ObjectiveScored', payload: { sessionId: session.id, slug: objective.slug, faction: change.factionKey } })
    } else {
      updateFactionPoints({ sessionId: session.id, faction: change.factionKey, points: factionPoints - objectivePoints })
      comboDispatch({ type: 'ObjectiveDescored', payload: { sessionId: session.id, slug: objective.slug, faction: change.factionKey } })
    }
  }, [comboDispatch, session.id, session.points, updateFactionPoints, availableObjectives])

  return <>
    <Grid container justifyContent='center'>
      {sessionObjectives.map(sessionObjective => <div
        className={clsx(classes.objectiveContainer, { [classes.small]: smallViewport })}
        key={sessionObjective.slug}
      >
        <ObjectiveWithFactionSelector
          size={smallViewport ? 'small' : 'default'}
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
            size={smallViewport ? 'small' : 'default'}
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
