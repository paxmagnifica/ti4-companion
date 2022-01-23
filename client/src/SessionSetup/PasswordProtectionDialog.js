import { useState, useCallback } from 'react'
import { Trans } from 'react-i18next'
import {
  Typography,
  TextField,
  DialogActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@material-ui/core'

export function PasswordProtectionDialog({ open, callback }) {
  const [password, setPassword] = useState('')
  const handlePasswordChange = useCallback((e) => {
    const { value } = e.target

    setPassword(value)
  }, [])

  return (
    <Dialog
      aria-labelledby="enable-edit-mode-dialog-title"
      disableEscapeKeyDown
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
