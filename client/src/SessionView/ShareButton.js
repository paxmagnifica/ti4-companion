import { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
} from '@material-ui/core'
import { Share } from '@material-ui/icons'
import QRCode from 'react-qr-code'
import { makeStyles } from '@material-ui/core/styles'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { generatePath } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'

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

  const path = useMemo(
    () =>
      generatePath(SESSION_VIEW_ROUTES.main, {
        sessionId: session.id,
      }),
    [session],
  )
  const fullUrl = useMemo(() => `${window.location.origin}${path}`, [path])

  const copyLink = useCallback(
    (e) => {
      navigator.clipboard.writeText(fullUrl)
      const copyButton = e.target
      copyButton.innerText = t('share.copied')
    },
    [fullUrl, t],
  )

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
    </>
  )
}

export default ShareButton
