import { useCallback, useState } from 'react'
import { Button, TextField } from '@material-ui/core'
import { Image as ImageIcon, Close as CloseIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { Trans } from 'react-i18next'

import ImagePicker from '../../shared/ImagePicker'

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
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState(null)

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

  const toggle = useCallback(() => {
    if (open) {
      setTitle('')
      setDescription('')
    }

    setOpen(!open)
  }, [open])

  const handleUpload = useCallback(async () => {
    await uploadEvent({ file, title, description })
    toggle()
  }, [file, description, title, uploadEvent, toggle])

  const saveActive = file || description || title

  return (
    <>
      <Button
        color={open ? 'primary' : 'secondary'}
        onClick={toggle}
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
            style={{ width: '15em' }}
            variant="contained"
          >
            Save
          </Button>
          <div className={classes.formContainer}>
            <TextField
              className={classes.inputWithMargin}
              color="secondary"
              fullWidth
              label="What happened?!"
              onChange={handleTitle}
              value={title}
              variant="filled"
            />
            <TextField
              className={classes.inputWithMargin}
              color="secondary"
              fullWidth
              label="What's the story"
              multiline
              onChange={handleDescription}
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
