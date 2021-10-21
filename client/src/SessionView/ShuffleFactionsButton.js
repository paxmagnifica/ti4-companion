import { useContext, useCallback, useState } from 'react'
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
import { useTranslation, Trans } from 'react-i18next'
import shuffle from 'lodash.shuffle'

import { DispatchContext, ComboDispatchContext } from '../state'

const useStyles = makeStyles((theme) => ({
  button: {
    color: 'white',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))

function ShuffleFactionsButton({ session }) {
  const { t } = useTranslation()
  const classes = useStyles()
  const { factions } = session
  const dispatch = useContext(DispatchContext)
  const comboDispatch = useContext(ComboDispatchContext)

  const [undoOptionOpen, setUndoOptionOpen] = useState(false)
  const [shuffling, setShuffling] = useState(false)
  const [factionsBeforeShuffle, setFactionsBeforeShuffle] = useState(factions)

  const shuffleFactions = useCallback(
    (dispatchStrategy) => {
      const shuffledFactions = shuffle(factions)
      const payload = {
        factions: shuffledFactions,
        sessionId: session.id,
      }
      dispatchStrategy({ type: 'FactionsShuffled', payload })
    },
    [session.id, factions],
  )

  const shuffleMultipleTimes = useCallback(async () => {
    const MAX_SHUFFLES = 30
    const MIN_SHUFFLES = 10
    const shuffles = Math.max(
      MIN_SHUFFLES,
      Math.floor(Math.random() * MAX_SHUFFLES),
    )

    setFactionsBeforeShuffle(factions)
    setShuffling(true)
    for (let i = 0; i < shuffles - 1; i += 1) {
      shuffleFactions(dispatch)
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) =>
        setTimeout(resolve, 80 + 40 * Math.floor(i / 10)),
      )
    }
    shuffleFactions(comboDispatch)
    setShuffling(false)
    setUndoOptionOpen(true)
  }, [shuffleFactions, factions, dispatch, comboDispatch])

  const setFactions = useCallback(
    (factionsToSet) => {
      const payload = { factions: factionsToSet, sessionId: session.id }
      comboDispatch({ type: 'FactionsShuffled', payload })
    },
    [session.id, comboDispatch],
  )

  const undoLastShuffle = useCallback(() => {
    setFactions(factionsBeforeShuffle)
    setUndoOptionOpen(false)
  }, [factionsBeforeShuffle, setFactions])

  return (
    <>
      <Tooltip placement="bottom" title={t('shuffle.tooltip')}>
        <IconButton
          aria-label={t('shuffle.tooltip')}
          className={classes.button}
          onClick={shuffleMultipleTimes}
        >
          <Casino />
        </IconButton>
      </Tooltip>
      <Backdrop className={classes.backdrop} open={shuffling}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        action={
          <>
            <Button color="secondary" onClick={undoLastShuffle} size="small">
              <Trans i18nKey="general.labels.undo" />
            </Button>
            <IconButton
              aria-label="close"
              color="inherit"
              onClick={() => setUndoOptionOpen(false)}
              size="small"
            >
              <Close fontSize="small" />
            </IconButton>
          </>
        }
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        autoHideDuration={10000}
        message={t('shuffle.shuffled')}
        onClose={() => setUndoOptionOpen(false)}
        open={undoOptionOpen}
      />
    </>
  )
}

export default ShuffleFactionsButton
