import { useContext, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Button,
  Grid,
  CircularProgress,
} from '@material-ui/core'
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
  const dispatch = useContext(DispatchContext)

  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(acceptedFiles => {
    const [theFile] = acceptedFiles
    setFile(theFile)
    setPreviewUrl(URL.createObjectURL(theFile))
  }, [])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    accept: ['image/jpg', 'image/png', 'image/jpeg'],
  })

  const upload = useCallback(async () => {
    setUploading(true)
    await service.uploadMap(file, sessionId)
    dispatch({ type: 'SetSessionMap', payload: { sessionId, map: previewUrl }})
  }, [file, sessionId, dispatch, previewUrl])

  return (
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
  )
}

export default MapUpload