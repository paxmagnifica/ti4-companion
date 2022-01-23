import { useCallback, useState } from 'react'
import { CircularProgress, Button, TextField } from '@material-ui/core'
import { Image as ImageIcon, Close as CloseIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { Trans, useTranslation } from 'react-i18next'

import ImagePicker from '../../shared/ImagePicker'
import { useDomainErrors } from '../../shared/errorHandling'

const useStyles = makeStyles({
  inputWithMargin: {
    marginBottom: '1em',
  },
  formContainer: {
    width: '300%',
    maxWidth: '100vw',
  },
})

function AddTimelineEvent({ uploadEvent }) {
  const classes = useStyles()
  const [uploading, setUploading] = useState(false)
  const [open, openSetter] = useState(false)
  const [file, setFile] = useState(null)
  const { t } = useTranslation()
  const { setError } = useDomainErrors()

  const [title, setTitle] = useState('')
  const handleTitle = useCallback((event) => {
    const { value } = event.target

    setTitle(value)
  }, [])

  const [description, setDescription] = useState('')
  const handleDescription = useCallback((event) => {
    const { value } = event.target

    setDescription(value)
  }, [])

  const setOpen = useCallback((o) => {
    if (!o) {
      setTitle('')
      setDescription('')
    }

    openSetter(o)
  }, [])

  const handleUpload = useCallback(async () => {
    setUploading(true)
    try {
      await uploadEvent({ file, title, description })
      setOpen(false)
    } catch (e) {
      setError(e)
    } finally {
      setUploading(false)
    }
  }, [file, description, title, uploadEvent, setOpen, setError])

  const saveActive = uploading || file || description || title

  return (
    <>
      <Button
        color={open ? 'primary' : 'secondary'}
        disabled={uploading}
        onClick={() => setOpen(!open)}
        style={{ width: open ? '4em' : '15em' }}
        variant="contained"
      >
        {open ? <CloseIcon /> : <Trans i18nKey="sessionTimeline.cta" />}
      </Button>
      {open && (
        <>
          <Button
            color="secondary"
            disabled={!saveActive}
            onClick={handleUpload}
            style={{ width: uploading ? '4em' : '15em' }}
            variant="contained"
          >
            {uploading ? (
              <CircularProgress size={20} />
            ) : (
              <Trans i18nKey="general.labels.save" />
            )}
          </Button>
          <div className={classes.formContainer}>
            <TextField
              className={classes.inputWithMargin}
              color="secondary"
              fullWidth
              label={t('sessionTimeline.titleLabel')}
              onChange={handleTitle}
              placeholder={t('general.labels.optional')}
              value={title}
              variant="filled"
            />
            <TextField
              className={classes.inputWithMargin}
              color="secondary"
              fullWidth
              label={t('sessionTimeline.descriptionLabel')}
              multiline
              onChange={handleDescription}
              placeholder={t('general.labels.optional')}
              rows={3}
              value={description}
              variant="filled"
            />
            <ImagePicker
              Icon={<ImageIcon style={{ fontSize: 40 }} />}
              onChange={setFile}
              previewAboveDropzone
              translations={{
                changeFile: 'sessionTimeline.changeFile',
                dropHere: 'sessionTimeline.dropHere',
                dragHere: 'sessionTimeline.dragHere',
                button: 'sessionTimeline.submit',
              }}
            />
          </div>
        </>
      )}
    </>
  )
}

export default AddTimelineEvent
