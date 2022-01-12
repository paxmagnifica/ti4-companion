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
        Protect editing with password
      </DialogTitle>
      <DialogContent>
        <Typography>
          Your players will need this password to edit the session
        </Typography>
        <TextField
          onChange={handlePasswordChange}
          type="password"
          value={password}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="secondary" onClick={() => callback({})}>
          do not set password
        </Button>
        <Button color="white" onClick={() => callback({ password })}>
          set password
        </Button>
      </DialogActions>
    </Dialog>
  )
}
