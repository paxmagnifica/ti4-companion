import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core'
import { useTranslation, Trans } from 'react-i18next'

function Confirmation({ open, title, children, confirm, cancel }) {
  const { t } = useTranslation()

  return (
    <Dialog maxWidth="xs" open={open}>
      <DialogTitle>{title || t('general.confirmation.title')}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button autoFocus color="secondary" onClick={cancel}>
          <Trans i18nKey="general.labels.cancel" />
        </Button>
        <Button color="secondary" onClick={confirm}>
          <Trans i18nKey="general.labels.ok" />
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Confirmation
