import { useContext, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Button,
  Grid,
  Snackbar,
  CircularProgress,
} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import { Map as MapIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import useSmallViewport from '../../shared/useSmallViewport'
import { DispatchContext } from '../../state'

import * as service from './service'

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
    opacity: .2,
    fontSize: ({ small }) => small ? '3em' : '10em',
    margin: 0,
    padding: 0,
  },
  mapPreview: {
    maxWidth: '80%',
    opacity: .85,
  },
})

function MapUpload({
  sessionId
}) {
  const small = useSmallViewport()
  const classes = useStyles({ small })
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [fileErrors, setFileErrors] = useState(null)
  const dispatch = useContext(DispatchContext)

  const [uploading, setUploading] = useState(false)

  const onDropAccepted = useCallback(acceptedFiles => {
    setFileErrors(null)
    const [theFile] = acceptedFiles

    setFile(theFile)
    setPreviewUrl(URL.createObjectURL(theFile))
  }, [])

  const onDropRejected = useCallback(fileRejections => {
    const [rejection] = fileRejections

    setFileErrors(rejection.errors)
  }, [])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDropAccepted,
    onDropRejected,
    maxFiles: 1,
    maxSize: 1000000,
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
    const result = await service.uploadMap(file, sessionId)
    if (result.ok) {
      dispatch({ type: 'SetSessionMap', payload: { sessionId, map: previewUrl }})
    }
  }, [file, sessionId, dispatch, previewUrl])

  return <>
    <Grid
      container
      alignItems='center'
      justifyContent='center'
      direction='column'
      spacing={2}
    >
      <Grid item>
        <div
          {...getRootProps()}
          className={classes.dropzone}
        >
          <input {...getInputProps()} />
          <MapIcon style={{ fontSize: 60 }}/>
          {
            file && <p>Change the map file</p>
          }
          {
            (!file && isDragActive) ?
              <p>Drop your map here...</p> :
              <p>Drag 'n' drop your map file here, or click to select the map file</p>
          }
          <p>Keep in mind that maps smaller than 800x800px are going to be small and unreadable</p>
        </div>
      </Grid>
      <Grid item>
        <Button
          disabled={!Boolean(file)}
          variant='contained'
          color='secondary'
          onClick={upload}
          endIcon={uploading ? <CircularProgress size={20} /> : null}
        >
          Upload
        </Button>
      </Grid>
      {file && <Grid
        item
        className={classes.previewContainer}
        container
        justifyContent="center"
      >
        <img
          className={classes.mapPreview}
          src={previewUrl}
          alt='your map'
        />
        <p className={classes.previewWatermark}>preview</p>
      </Grid>}
    </Grid>
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={fileErrors}
      autoHideDuration={5000}
      onClose={handleSnackbarClose}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        severity="error"
      >
        {(fileErrors || []).map(fe => fe.message).join(';')}
      </MuiAlert>
    </Snackbar>
  </>
}

export default MapUpload
