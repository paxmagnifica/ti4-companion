import { useState, useContext, useCallback } from 'react'
import { Snackbar, Grid, Button, IconButton } from '@material-ui/core'
import { useTranslation, Trans } from 'react-i18next'
import { Lock, Close } from '@material-ui/icons'

import { ComboDispatchContext } from '../state'

export default function LockForEdit({ session }) {
  const comboDispatch = useContext(ComboDispatchContext)
  const [undoOptionOpen, setUndoOptionOpen] = useState(false)
  const { t } = useTranslation()

  const lockSession = useCallback(() => {
    comboDispatch({
      type: 'LockSession',
      payload: { sessionId: session.id },
    })
    setUndoOptionOpen(true)
  }, [comboDispatch, session.id])

  const unlockSession = useCallback(() => {
    comboDispatch({
      type: 'UnlockSession',
      payload: { sessionId: session.id },
    })
    setUndoOptionOpen(false)
  }, [comboDispatch, session.id])

  return (
    <>
      {session.finished && !session.locked && (
        <Grid container justifyContent="center">
          <Button
            color="secondary"
            endIcon={<Lock />}
            onClick={lockSession}
            startIcon={<Lock />}
            variant="contained"
          >
            <Trans i18nKey="sessionView.lock" />
          </Button>
        </Grid>
      )}
      <Snackbar
        action={
          <>
            <Button color="secondary" onClick={unlockSession} size="small">
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
        autoHideDuration={7000}
        message={t('sessionView.locked')}
        onClose={() => setUndoOptionOpen(false)}
        open={undoOptionOpen}
      />
    </>
  )
}
