import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DialogActions,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Edit } from '@material-ui/icons'

import { useSessionContext } from '../SessionProvider'

import { EditPasswordDialog } from './EditPasswordDialog'

const useStyles = makeStyles({
  button: {
    color: 'white',
  },
})

function ConfirmationDialog(props) {
  const { onClose, onCancel, title, message, onConfirm, open, ...other } = props

  const handleCancel = () => {
    onCancel()
  }

  const handleOk = () => {
    onConfirm()
  }

  return (
    <Dialog
      aria-labelledby="confirmation-dialog-title"
      maxWidth="xs"
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button autoFocus color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button color="white" onClick={handleOk}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function EditButton() {
  const { t } = useTranslation()
  const classes = useStyles()
  const { editable, disableEdit } = useSessionContext()

  const [confirmationOpen, setConfirmationOpen] = useState()
  const onConfirm = useCallback(() => {
    // clear secret
    disableEdit()
    setConfirmationOpen(false)
  }, [disableEdit])

  const [editPasswordOpen, setEditPasswordOpen] = useState()

  const onClose = useCallback(() => {
    setConfirmationOpen(false)
    setEditPasswordOpen(false)
  }, [])
  const handleClick = useCallback(() => {
    if (editable) {
      setConfirmationOpen(true)

      return
    }

    setEditPasswordOpen(true)
  }, [editable])

  return (
    <>
      <Tooltip placement="bottom" title={t('edit.tooltip')}>
        <IconButton
          aria-label={t('edit.tooltip')}
          className={classes.button}
          onClick={handleClick}
        >
          <Edit color={editable ? 'secondary' : ''} />
        </IconButton>
      </Tooltip>
      <ConfirmationDialog
        keepMounted
        message="Are you sure to cancel edit?"
        onCancel={onClose}
        onConfirm={onConfirm}
        open={confirmationOpen}
        title="Disable editing"
      />
      <EditPasswordDialog onClose={onClose} open={editPasswordOpen} />
    </>
  )
}
