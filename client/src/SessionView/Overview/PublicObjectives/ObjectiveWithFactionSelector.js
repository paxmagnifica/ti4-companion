import { makeStyles } from '@material-ui/core/styles'

import Objective from '../../../shared/Objective'

import FactionSelector from './FactionSelector'
import DeleteObjectiveButton from './DeleteObjectiveButton'

const useStyles = makeStyles({
  deleteButton: {
    position: 'absolute',
    top: '-1.5em',
    right: '-1.5em',
    zIndex: 2,
    opacity: 0.4,
    '&:hover': {
      opacity: 1,
    },
  },
})

function ObjectiveWithFactionSelector({
  disabled,
  size,
  objective,
  selector,
  session,
  deletable,
}) {
  const classes = useStyles()

  return (
    <>
      {deletable && (
        <DeleteObjectiveButton
          className={classes.deleteButton}
          objective={objective}
          session={session}
        />
      )}
      <FactionSelector disabled={disabled} size={size} {...selector} />
      <Objective session={session} size={size} {...objective} />
    </>
  )
}

export default ObjectiveWithFactionSelector
