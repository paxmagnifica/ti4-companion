import { useContext, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button, Grid, Snackbar, CircularProgress } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import { Map as MapIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation, Trans } from 'react-i18next'

import useSmallViewport from '../../shared/useSmallViewport'
import { DispatchContext } from '../../state'

const useStyles = makeStyles({
  dropzone: {
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, .1)',
    padding: '1em',
    borderRadius: 5,
    cursor: 'pointer',
  },
  previewContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  previewWatermark: {
    position: 'absolute',
    textTransform: 'uppercase',
    color: '#fff',
    top: '50%',
    width: '100%',
    textAlign: 'center',
    transform: 'translateY(-50%) rotate(45deg)',
    transformOrigin: 'center center',
    opacity: 0.2,
    fontSize: ({ small }) => (small ? '3em' : '10em'),
    margin: 0,
    padding: 0,
  },
  mapPreview: {
    maxWidth: '80%',
    opacity: 0.85,
  },
})

function MapUpload({ sessionService, sessionId }) {
  const { t } = useTranslation()
  const small = useSmallViewport()
  const classes = useStyles({ small })
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [fileErrors, setFileErrors] = useState(null)
  const dispatch = useContext(DispatchContext)

  const [uploading, setUploading] = useState(false)

  const onDropAccepted = useCallback((acceptedFiles) => {
    setFileErrors(null)
    const [theFile] = acceptedFiles

    setFile(theFile)
    setPreviewUrl(URL.createObjectURL(theFile))
  }, [])

  const onDropRejected = useCallback((fileRejections) => {
    const [rejection] = fileRejections

    setFileErrors(rejection.errors)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted,
    onDropRejected,
    maxFiles: 1,
    maxSize: 3000000,
    multiple: false,
    accept: ['image/jpg', 'image/png', 'image/jpeg'],
  })
  const handleSnackbarClose = useCallback((_, reason) => {
    if (reason === 'timeout') {
      setFileErrors(null)
    }
  }, [])

  const upload = useCallback(async () => {
    setUploading(true)
    const result = await sessionService.uploadMap(file, sessionId)
    if (result.ok) {
      dispatch({
        type: 'SetSessionMap',
        payload: { sessionId, map: previewUrl },
      })
    }
  }, [file, sessionId, dispatch, previewUrl, sessionService])

  return (
    <>
      <Grid item>
        <div {...getRootProps()} className={classes.dropzone}>
          <input {...getInputProps()} />
          <MapIcon style={{ fontSize: 60 }} />
          {file && (
            <p>
              <Trans i18nKey="sessionMap.changeFile" />
            </p>
          )}
          {!file && isDragActive ? (
            <p>
              <Trans i18nKey="sessionMap.dropHere" />
            </p>
          ) : (
            <p>
              <Trans i18nKey="sessionMap.dragHere" />
            </p>
          )}
          <p>
            <Trans i18nKey="sessionMap.sizeHint" />
          </p>
        </div>
      </Grid>
      <Grid item>
        <Button
          color="secondary"
          disabled={!file}
          endIcon={uploading ? <CircularProgress size={20} /> : null}
          onClick={upload}
          variant="contained"
        >
          Upload
        </Button>
      </Grid>
      {file && (
        <Grid
          className={classes.previewContainer}
          container
          item
          justifyContent="center"
        >
          <img
            alt={t('sessionMap.map')}
            className={classes.mapPreview}
            src={previewUrl}
          />
          <p className={classes.previewWatermark}>
            <Trans i18nKey="sessionMap.preview" />
          </p>
        </Grid>
      )}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        open={fileErrors}
      >
        <MuiAlert elevation={6} severity="error" variant="filled">
          {(fileErrors || []).map((fe) => fe.message).join(';')}
        </MuiAlert>
      </Snackbar>
    </>
  )
}

export default MapUpload
