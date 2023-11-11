import { useState, useCallback } from 'react'
import {
  Typography,
  TextField,
  CircularProgress,
  DialogActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@material-ui/core'

import CONFIG from '../config'
import { Trans } from '../i18n'
import { useFetch } from '../useFetch'

export function ListIdentifierDialog({
  initialIdentifier,
  open,
  onAccept,
  onClose,
}) {
  const [identifier, setIdentifier] = useState(initialIdentifier)
  const [identifierInvalid, setIdentifierInvalid] = useState(false)
  const [loading, setLoading] = useState(false)
  const { fetch } = useFetch()

  const handleIdentifierChange = useCallback((e) => {
    const { value } = e.target

    setIdentifier(value)
  }, [])

  const closeCallback = useCallback(() => {
    if (loading) {
      return
    }

    setIdentifier(initialIdentifier)
    setIdentifierInvalid(false)

    onClose()
  }, [onClose, loading])

  const isValid = useCallback(
    (listId) =>
      fetch(`${CONFIG.apiUrl}/api/sessionList/${listId}`).then(
        (response) => response.ok,
      ),
    [fetch],
  )

  const handleAccept = useCallback(
    async (e) => {
      try {
        e.preventDefault()
        setLoading(true)
        if (await isValid(identifier)) {
          onAccept(identifier)

          return
        }

        setIdentifierInvalid(true)
      } finally {
        setLoading(false)
      }
    },
    [identifier, isValid],
  )

  return (
    <Dialog
      aria-labelledby="enable-edit-mode-dialog-title"
      onClose={closeCallback}
      open={open}
    >
      <DialogTitle id="enable-edit-mode-dialog-title">
        <Trans i18nKey="sessionList.changeListDialog.title" />
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleAccept}>
          <TextField
            autoFocus
            color="secondary"
            label={<Trans i18nKey="sessionList.changeListDialog.current" />}
            onChange={handleIdentifierChange}
            value={identifier}
            error={identifierInvalid}
            helperText={
              identifierInvalid ? (
                <Trans i18nKey="sessionList.changeListDialog.identifierInvalid" />
              ) : null
            }
            disabled={loading}
          />
        </form>
        <Typography style={{ marginTop: '0.5em' }}>
          <em>
            <Trans i18nKey="sessionList.changeListDialog.whyChangeList" />
          </em>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          color="secondary"
          onClick={onClose}
          disabled={loading}
        >
          <Trans i18nKey="general.labels.cancel" />
        </Button>
        <Button
          color="white"
          onClick={handleAccept}
          disabled={loading}
          endIcon={
            loading ? <CircularProgress color="secondary" size={15} /> : null
          }
        >
          <Trans i18nKey="general.labels.save" />
        </Button>
      </DialogActions>
    </Dialog>
  )
}
