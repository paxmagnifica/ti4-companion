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
import QRCode from 'react-qr-code'
import { Share } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { generatePath } from 'react-router-dom'

import { SESSION_VIEW_ROUTES } from '../shared/constants'

const useStyles = makeStyles({
  button: {
    color: 'white',
  },
})

function ShareButton({
  editable,
  session,
}) {
  const classes = useStyles()
  const [showQr, setShowQr] = useState(false)
  const [allowEdit, setAllowEdit] = useState(false)
  const toggleAllowEdit = useCallback(() => setAllowEdit(x => !x), [])

  const path = useMemo(() => generatePath(SESSION_VIEW_ROUTES.main, {
    sessionId: session.id,
    secret: allowEdit ? session.secret : undefined,
  }), [session, allowEdit])
  const fullUrl = useMemo(() => `${window.location.origin}${path}`, [path])

	const copyLink = useCallback(e => {
		navigator.clipboard.writeText(fullUrl)
		const copyButton = e.target;
		copyButton.innerText = "Copied!";
	}, [fullUrl])

  return <>
    <Tooltip title="show qr code" placement="bottom">
      <IconButton
        className={classes.button}
        onClick={() => setShowQr(true)}
        aria-label="show qr code"
      >
        <Share />
      </IconButton>
    </Tooltip>
    <Dialog
      open={showQr}
      onClose={() => setShowQr(false)}
    >
      {editable && <DialogTitle>
        <FormControlLabel
          control={<Switch color='secondary' checked={allowEdit} onChange={toggleAllowEdit} />}
          label="Allow edit"
        />
      </DialogTitle>}
      <DialogContent>
        <QRCode value={fullUrl} />
      </DialogContent>
	  <Button onClick={copyLink} variant="contained">Copy <FileCopyIcon/> </Button>
    </Dialog>
  </>
}

export default ShareButton
