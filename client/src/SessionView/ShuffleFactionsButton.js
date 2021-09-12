import { useCallback, useState } from 'react'
import {
  Backdrop,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  Tooltip,
} from '@material-ui/core'
import { Casino, Close } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  button: {
    color: 'white',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))

function ShuffleFactionsButton({
  factions,
  shuffleFactions,
  setFactions,
}) {
  const classes = useStyles()

  const [undoOptionOpen, setUndoOptionOpen] = useState(false)
  const [shuffling, setShuffling] = useState(false)
  const [factionsBeforeShuffle, setFactionsBeforeShuffle] = useState(factions)
  const shuffleMultipleTimes = useCallback(async () => {
    const MAX_SHUFFLES = 30
    const MIN_SHUFFLES = 10
    const shuffles = Math.max(MIN_SHUFFLES, Math.floor(Math.random() * MAX_SHUFFLES))

    setFactionsBeforeShuffle(factions)
    setShuffling(true)
    for(let i = 0; i < shuffles; ++i) {
      shuffleFactions()
      await new Promise(resolve => setTimeout(resolve, 80 + 40 * Math.floor(i / 10)))
    }
    setShuffling(false)
    setUndoOptionOpen(true)
  }, [shuffleFactions, factions])

  const undoLastShuffle = useCallback(() => {
    setFactions(factionsBeforeShuffle)
    setUndoOptionOpen(false)
  }, [factionsBeforeShuffle, setFactions])

  return <>
    <Tooltip title="shuffle faction order" placement="bottom">
      <IconButton
        className={classes.button}
        onClick={shuffleMultipleTimes}
        aria-label="shuffle faction order"
      >
        <Casino />
      </IconButton>
    </Tooltip>
    <Backdrop className={classes.backdrop} open={shuffling} >
      <CircularProgress color="inherit"/>
    </Backdrop>
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={undoOptionOpen}
      autoHideDuration={10000}
      onClose={() => setUndoOptionOpen(false)}
      message="Factions shuffled"
      action={
        <>
          <Button color="secondary" size="small" onClick={undoLastShuffle}>
            UNDO
          </Button>
          <IconButton size="small" aria-label="close" color="inherit" onClick={() => setUndoOptionOpen(false)}>
            <Close fontSize="small" />
          </IconButton>
        </>
      }
    />
  </>
}

export default ShuffleFactionsButton
