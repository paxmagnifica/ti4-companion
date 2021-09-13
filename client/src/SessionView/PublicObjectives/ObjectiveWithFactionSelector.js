import { useState } from 'react'
import {
  Dialog,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import Objective from './Objective'
import FactionSelector from './FactionSelector'

const useStyles = makeStyles({
  dialog: {
    '& .MuiPaper-root': {
      backgroundColor: 'transparent',
    }
  },
  clickableObjective: {
    cursor: 'pointer',
  }
})

function ObjectiveWithFactionSelector({
  small,
  objective,
  selector,
}) {
  const classes = useStyles()
  const [bigObjectiveOpen, setBigObjectiveOpen] = useState(false)

  if (!small) {
    return <>
      <Objective
        small={small}
        {...objective}
      />
      <FactionSelector
        small={small}
        {...selector}
      />
    </>
  }

  return <>
    <Objective
      className={classes.clickableObjective}
      small={small}
      onClick={() => setBigObjectiveOpen(true)}
      {...objective}
    />
    <FactionSelector
      small={small}
      {...selector}
    />
    <Dialog
      className={classes.dialog}
      open={bigObjectiveOpen}
      onClose={() => setBigObjectiveOpen(false)}
    >
      <Objective
        {...objective}
      />
      <FactionSelector
        {...selector}
      />
    </Dialog>
  </>
}

export default ObjectiveWithFactionSelector
