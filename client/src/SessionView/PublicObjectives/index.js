import { useCallback, useMemo, useState, useContext } from 'react'
import {
  Grid,
  IconButton,
} from '@material-ui/core'

import { DispatchContext } from '../../state'

import Objective from './Objective'
import AddObjective from './AddObjective'

function PublicObjectives({
  session,
}) {
  const dispatch = useContext(DispatchContext)
  const sessionObjectives = useMemo(() => session.objectives || [], [session])
  const [addObjectiveOpen, setAddObjectiveOpen] = useState(false)

  const objectiveAdded = useCallback(objective => {
    dispatch({ type: 'addObjective', payload: { sessionId: session.id, objective } })
    setAddObjectiveOpen(false)
  }, [dispatch, session.id])

  return <>
    <Grid container justifyContent='center'>
      {sessionObjectives.map(sessionObjective => <Objective
        {...sessionObjective}
        style={{ margin: 12 }}
      />)}
      <IconButton
        onClick={() => setAddObjectiveOpen(true)}
        style={{ padding: 0, margin: 12 }}
      >
        <Objective
          reverse
          title='new Stage I objective'
        />
      </IconButton>
    </Grid>
    <AddObjective
      open={addObjectiveOpen}
      onCancel={() => setAddObjectiveOpen(false)}
      onSelect={objectiveAdded}
    />
  </>
}

export default PublicObjectives
