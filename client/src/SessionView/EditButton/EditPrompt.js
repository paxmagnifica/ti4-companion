import React, { useCallback } from 'react'
import { Snackbar, Button, IconButton } from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'

import { useSessionContext } from '../SessionProvider'

export function EditPrompt({ children, fullWidth }) {
  const {
    editable,
    editFeature: { setEnableEditPromptOpen },
  } = useSessionContext()

  const nonEditableCallback = useCallback(() => {
    if (editable) {
      return
    }

    setEnableEditPromptOpen(true)
  }, [editable, setEnableEditPromptOpen])

  return (
    <span
      onClick={nonEditableCallback}
      style={{
        width: fullWidth ? '100%' : 'auto',
        display: 'inline-flex',
      }}
    >
      {children}
    </span>
  )
}

export function EditPromptProvider() {
  const {
    editFeature: {
      enableEditPromptOpen,
      setEnableEditPromptOpen,
      setEnableEditDialogOpen,
    },
  } = useSessionContext()
  const handleClose = useCallback(
    (_, reason) => {
      if (reason === 'clickaway') {
        return
      }

      setEnableEditPromptOpen(false)
    },
    [setEnableEditPromptOpen],
  )

  const enableEdit = useCallback(() => {
    setEnableEditPromptOpen(false)
    setEnableEditDialogOpen(true)
  }, [setEnableEditDialogOpen, setEnableEditPromptOpen])

  return (
    <Snackbar
      action={
        <>
          <Button color="secondary" onClick={enableEdit} size="small">
            ENABLE EDIT
          </Button>
          <IconButton
            aria-label="close"
            color="inherit"
            onClick={handleClose}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      }
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      autoHideDuration={3000}
      message="To make changes you have to "
      onClose={handleClose}
      open={enableEditPromptOpen}
    />
  )
}
