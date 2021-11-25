import { useContext, useCallback } from 'react'
import { Map as MapIcon } from '@material-ui/icons'

import ImageUpload from '../../shared/ImageUpload'
import { DispatchContext } from '../../state'

function MapUpload({ sessionService, sessionId }) {
  const dispatch = useContext(DispatchContext)

  const upload = useCallback(
    async (file, previewUrl) => {
      const result = await sessionService.uploadMap(file, sessionId)
      if (result.ok) {
        dispatch({
          type: 'SetSessionMap',
          payload: { sessionId, map: previewUrl },
        })
      }
    },
    [sessionId, dispatch, sessionService],
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
