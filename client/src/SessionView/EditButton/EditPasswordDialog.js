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

import { useSessionContext } from '../SessionProvider'

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
        onSuccess: (data, variables, context) => {
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
        Password protected
      </DialogTitle>
      <DialogContent>
        <Typography>provide password given by game owner to edit:</Typography>
        <TextField
          onChange={handlePasswordChange}
          type="password"
          value={password}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="secondary" onClick={close}>
          Cancel
        </Button>
        <Button color="white" onClick={exchangePasswordForSecret}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
