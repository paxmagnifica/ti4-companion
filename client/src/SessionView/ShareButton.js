import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
  Button,
} from '@material-ui/core'
import QRCode from 'react-qr-code'
import { Share } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import FileCopyIcon from '@material-ui/icons/FileCopy';
const useStyles = makeStyles({
  button: {
    color: 'white',
  },
})

function ShareButton({
  id
}) {
  const classes = useStyles()
  const [showQr, setShowQr] = useState(false)

	const copyLink = (e)=>{
		navigator.clipboard.writeText(`${window.location.origin}/${id}`);
		const copyButton = e.target;
		copyButton.innerText = "Copied!";
	}

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
      <DialogContent>
        <QRCode value={`${window.location.origin}/${id}`} />
      </DialogContent>
	  <Button onClick={copyLink} variant="contained">Copy <FileCopyIcon/> </Button>
    </Dialog>
  </>
}

export default ShareButton
