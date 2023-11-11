import { IconButton, Snackbar } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import { FileCopy } from '@material-ui/icons'
import { useCallback, useState } from 'react'
import { Trans } from 'react-i18next'

export function CopyListIdentifierButton({ listIdentifier }) {
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false)
  const copyListIdentifier = useCallback(() => {
    navigator.clipboard.writeText(listIdentifier)
    setShowConfirmationMessage(true)
  }, [listIdentifier])

  return (
    <>
      <IconButton onClick={copyListIdentifier} size="small">
        <FileCopy />
      </IconButton>
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
