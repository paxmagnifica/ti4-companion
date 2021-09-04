import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
} from '@material-ui/core'
import QRCode from 'react-qr-code'
import { Share } from '@material-ui/icons'

function ShareButton({
  id
}) {
  const [showQr, setShowQr] = useState(false)

  return <>
    <Tooltip title="show qr code" placement="bottom">
      <IconButton
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
    </Dialog>
  </>
}

export default ShareButton
