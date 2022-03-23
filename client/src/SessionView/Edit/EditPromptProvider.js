import React, { useCallback } from 'react'
import { Snackbar, Button, IconButton } from '@material-ui/core'
import { Edit as EditIcon, Close as CloseIcon } from '@material-ui/icons'
import { Trans, useTranslation } from 'react-i18next'

import { useSessionContext } from '../useSessionContext'

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

  const { t } = useTranslation()

  return (
    <Snackbar
      action={
        <>
          <Button
            color="secondary"
            endIcon={<EditIcon />}
            onClick={enableEdit}
            size="small"
          >
            <Trans i18nKey="editProtection.enableEdit.title" />
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
        horizontal: 'center',
      }}
      autoHideDuration={5000}
      message={t('editProtection.enableEdit.toMakeChanges')}
      onClose={handleClose}
      open={enableEditPromptOpen}
    />
  )
}
