import { useContext, useCallback } from 'react'
import { Map as MapIcon } from '@material-ui/icons'

import ImageUpload from '../../shared/ImageUpload'
import { useDomainErrors } from '../../shared/errorHandling'
import { DispatchContext } from '../../state'

function MapUpload({ sessionService, sessionId }) {
  const dispatch = useContext(DispatchContext)
  const { setError } = useDomainErrors()

  const upload = useCallback(
    async (file, previewUrl) => {
      try {
        const result = await sessionService.uploadMap(file, sessionId)
        if (result.ok) {
          dispatch({
            type: 'SetSessionMap',
            payload: { sessionId, map: previewUrl },
          })
        }
      } catch (e) {
        setError(e)
      }
    },
    [sessionId, dispatch, sessionService, setError],
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
