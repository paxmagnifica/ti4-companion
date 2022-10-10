import { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Snackbar,
  Tooltip,
} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import { Share } from '@material-ui/icons'
import QRCode from 'react-qr-code'
import { makeStyles } from '@material-ui/core/styles'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { generatePath } from 'react-router-dom'

import { useTranslation, Trans } from '../i18n'
import { SESSION_VIEW_ROUTES } from '../shared/constants'

const useStyles = makeStyles({
  button: {
    color: 'white',
  },
})

function ShareButton({ session }) {
  const { t } = useTranslation()
  const classes = useStyles()
  const [showQr, setShowQr] = useState(false)
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false)

  const path = useMemo(
    () =>
      generatePath(SESSION_VIEW_ROUTES.main, {
        sessionId: session.id,
      }),
    [session],
  )
  const fullUrl = useMemo(() => `${window.location.origin}${path}`, [path])

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(fullUrl)
    setShowQr(false)
    setShowConfirmationMessage(true)
  }, [fullUrl])

  return (
    <>
      <Tooltip placement="bottom" title={t('share.tooltip')}>
        <IconButton
          aria-label={t('share.tooltip')}
          className={classes.button}
          onClick={() => setShowQr(true)}
        >
          <Share />
        </IconButton>
      </Tooltip>
      <Dialog onClose={() => setShowQr(false)} open={showQr}>
        <DialogContent>
          <QRCode value={fullUrl} />
        </DialogContent>
        <Button onClick={copyLink} variant="contained">
          <Trans i18nKey="general.labels.copy" /> <FileCopyIcon />{' '}
        </Button>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={2000}
        onClose={() => {
          setShowConfirmationMessage(false)
        }}
        open={showConfirmationMessage}
      >
        <MuiAlert
          onClose={() => {
            setShowConfirmationMessage(false)
          }}
          severity="success"
        >
          <Trans i18nKey="share.copied" />
        </MuiAlert>
      </Snackbar>
    </>
  )
}

export default ShareButton
