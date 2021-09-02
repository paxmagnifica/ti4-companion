import { useCallback, useState } from 'react'
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@material-ui/core'
import { Casino } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))

function ShuffleFactionsButton({
  shuffleFactions
}) {
  const classes = useStyles()

  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [shuffling, setShuffling] = useState(false)
  const shuffleMultipleTimes = useCallback(async () => {
    const MAX_SHUFFLES = 50
    const MIN_SHUFFLES = 20
    const shuffles = Math.max(MIN_SHUFFLES, Math.floor(Math.random() * MAX_SHUFFLES))

    setConfirmationOpen(false)
    setShuffling(true)
    for(let i = 0; i < shuffles; ++i) {
      shuffleFactions()
      await new Promise(resolve => setTimeout(resolve, 80 + 40 * Math.floor(i / 10)))
    }
    setShuffling(false)
  }, [shuffleFactions])

  return <>
    <Tooltip title="shuffle faction order" placement="bottom">
      <IconButton
        onClick={() => setConfirmationOpen(true)}
        aria-label="shuffle faction order"
      >
        <Casino />
      </IconButton>
    </Tooltip>
    <Backdrop className={classes.backdrop} open={shuffling} >
      <CircularProgress color="inherit"/>
    </Backdrop>
    <Dialog
      open={confirmationOpen}
      onClose={() => setConfirmationOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>Are you sure you want to shuffle factions?</DialogTitle>
      <DialogContent>
        You will lose current ordering!
      </DialogContent>
      <DialogActions>
        <Button onClick={shuffleMultipleTimes} color="secondary" >
          Yes, shuffle
        </Button>
        <Button onClick={() => setConfirmationOpen(false)} color="primary" autoFocus>
          Don't shuffle
        </Button>
      </DialogActions>
    </Dialog>
  </>
}

export default ShuffleFactionsButton
