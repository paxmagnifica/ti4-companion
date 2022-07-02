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

import { Trans } from '../i18n'

export function PasswordProtectionDialog({ open, callback, onClose }) {
  const [password, setPassword] = useState('')
  const handlePasswordChange = useCallback((e) => {
    const { value } = e.target

    setPassword(value)
  }, [])

  const closeCallback = useCallback(() => {
    setPassword('')
    onClose()
  }, [onClose])

  return (
    <Dialog
      aria-labelledby="enable-edit-mode-dialog-title"
      onClose={closeCallback}
      open={open}
    >
      <DialogTitle id="enable-edit-mode-dialog-title">
        <Trans i18nKey="editProtection.passwordDialog.title" />
      </DialogTitle>
      <DialogContent>
        <Typography>
          <Trans i18nKey="editProtection.passwordDialog.purpose" />
        </Typography>
        <TextField
          onChange={handlePasswordChange}
          type="password"
          value={password}
        />
        <Typography>
          <Trans i18nKey="editProtection.passwordDialog.reminder" />
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="secondary" onClick={() => callback({})}>
          <Trans i18nKey="editProtection.passwordDialog.noPassword" />
        </Button>
        <Button color="white" onClick={() => callback({ password })}>
          <Trans i18nKey="editProtection.passwordDialog.setPassword" />
        </Button>
      </DialogActions>
    </Dialog>
  )
}
