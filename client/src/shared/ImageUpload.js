import { useState, useCallback } from 'react'
import { Button, Grid, CircularProgress } from '@material-ui/core'
import { Trans } from 'react-i18next'

import ImagePicker from './ImagePicker'

function ImageUpload({ upload, translations, Icon }) {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')

  const [uploading, setUploading] = useState(false)

  const handleUpload = useCallback(async () => {
    try {
      setUploading(true)
      await upload(file, previewUrl)
    } finally {
      setUploading(false)
    }
  }, [upload, file, previewUrl])

  const handleImagePicked = useCallback((theFile, url) => {
    setFile(theFile)
    setPreviewUrl(url)
  }, [])

  return (
    <>
      <ImagePicker
        Icon={Icon}
        onChange={handleImagePicked}
        translations={translations}
      />
      <Grid item>
        <Button
          color="secondary"
          disabled={!file}
          endIcon={uploading ? <CircularProgress size={20} /> : null}
          onClick={handleUpload}
          variant="contained"
        >
          <Trans i18nKey={translations.button || 'general.labels.upload'} />
        </Button>
      </Grid>
    </>
  )
}

export default ImageUpload
