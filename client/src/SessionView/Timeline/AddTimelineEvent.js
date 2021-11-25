import { useCallback, useState } from 'react'
import { Button } from '@material-ui/core'
import { Image as ImageIcon, Close as CloseIcon } from '@material-ui/icons'
import { Trans } from 'react-i18next'

import ImageUpload from '../../shared/ImageUpload'

function AddTimelineEvent({ uploadEvent }) {
  const [open, setOpen] = useState(false)

  const handleUpload = useCallback(
    async (file) => {
      await uploadEvent(file)
      setOpen(false)
    },
    [uploadEvent],
  )

  return (
    <>
      <Button
        color="secondary"
        onClick={() => setOpen((a) => !a)}
        style={{ width: '15em' }}
        variant="contained"
      >
        {open ? <CloseIcon /> : <Trans i18nKey="sessionTimeline.cta" />}
      </Button>
      {open && (
        <ImageUpload
          Icon={<ImageIcon style={{ fontSize: 40 }} />}
          translations={{
            changeFile: 'sessionTimeline.changeFile',
            dropHere: 'sessionTimeline.dropHere',
            dragHere: 'sessionTimeline.dragHere',
            button: 'sessionTimeline.submit',
          }}
          upload={handleUpload}
        />
      )}
    </>
  )
}

export default AddTimelineEvent
