import { useState, useCallback } from 'react'
import {
  Typography,
  TextField,
  DialogActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@material-ui/core'

import { Trans } from '../../i18n'
import { useSessionContext } from '../useSessionContext'

import { usePassword } from './queries'

export function EditPasswordDialog(props) {
  const { open, onClose } = props
  const { mutate } = usePassword()
  const { setSecret, session } = useSessionContext()

  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const handlePasswordChange = useCallback((e) => {
    const { value } = e.target

    setPassword(value)
  }, [])
  const close = useCallback(() => {
    setPassword('')
    onClose()
  }, [onClose])
  const exchangePasswordForSecret = useCallback(async () => {
    setLoading(true)
    const sessionId = session.id

    mutate(
      { sessionId, password },
      {
        onSuccess: (data) => {
          const { secret } = data
          setSecret(secret)
          setLoading(false)
          close()
        },
        onError: (error, variables, context) => {
          setLoading(false)
          console.error({ error, variables, context })
        },
      },
    )
  }, [mutate, session.id, password, setSecret, close])

  return (
    <Dialog
      aria-labelledby="enable-edit-mode-dialog-title"
      onClose={close}
      open={open}
    >
      <DialogTitle id="enable-edit-mode-dialog-title">
        {session.secured ? (
          <Trans i18nKey="editProtection.enableEdit.secured.title" />
        ) : (
          <Trans i18nKey="editProtection.enableEdit.title" />
        )}
      </DialogTitle>
      {session.secured && (
        <DialogContent>
          <Typography>
            <Trans i18nKey="editProtection.enableEdit.secured.prompt" />
          </Typography>
          <TextField
            onChange={handlePasswordChange}
            type="password"
            value={password}
          />
        </DialogContent>
      )}
      {!session.secured && (
        <DialogContent>
          <Typography>
            <Trans i18nKey="editProtection.enableEdit.prompt" />
          </Typography>
        </DialogContent>
      )}
      <DialogActions>
        <Button autoFocus color="secondary" onClick={close}>
          <Trans i18nKey="general.labels.cancel" />
        </Button>
        <Button color="white" onClick={exchangePasswordForSecret}>
          <Trans i18nKey="editProtection.enableEdit.action" />
        </Button>
      </DialogActions>
    </Dialog>
  )
}
