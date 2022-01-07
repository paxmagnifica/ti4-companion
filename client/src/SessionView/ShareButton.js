import { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Switch,
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

function ShareButton({ editable, session }) {
  const { t } = useTranslation()
  const classes = useStyles()
  const [showQr, setShowQr] = useState(false)
  const [allowEdit, setAllowEdit] = useState(false)
  const toggleAllowEdit = useCallback(() => setAllowEdit((x) => !x), [])

  const path = useMemo(
    () =>
      generatePath(SESSION_VIEW_ROUTES.main, {
        sessionId: session.id,
        secret: allowEdit ? session.secret : undefined,
      }),
    [session, allowEdit],
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
        {editable && (
          <DialogTitle>
            <FormControlLabel
              control={
                <Switch
                  checked={allowEdit}
                  color="secondary"
                  onChange={toggleAllowEdit}
                />
              }
              label={t('share.allowEdit')}
            />
          </DialogTitle>
        )}
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
