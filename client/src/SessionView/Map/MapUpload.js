import { useCallback } from 'react'
import { Map as MapIcon } from '@material-ui/icons'

import ImageUpload from '../../shared/ImageUpload'
import { useDomainErrors } from '../../shared/errorHandling'
import useInvalidateQueries from '../../useInvalidateQueries'

function MapUpload({ sessionService, sessionId, onUpload }) {
  const { setError } = useDomainErrors()
  const invalidateQueries = useInvalidateQueries()

  const upload = useCallback(
    async (file, previewUrl) => {
      try {
        const result = await sessionService.uploadMap(file, sessionId)
        if (result.ok) {
          onUpload(previewUrl)
          // TODO move out
          invalidateQueries(['session', sessionId])
        }
      } catch (e) {
        setError(e)
      }
    },
    [sessionId, onUpload, sessionService, setError, invalidateQueries],
  )

  return (
    <ImageUpload
      Icon={<MapIcon style={{ fontSize: 60 }} />}
      translations={{
        changeFile: 'sessionMap.changeFile',
        dropHere: 'sessionMap.dropHere',
        dragHere: 'sessionMap.dragHere',
        sizeHint: 'sessionMap.sizeHint',
      }}
      upload={upload}
    />
  )
}

export default MapUpload
