import { useCallback, useState } from 'react'
import { Map as MapIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'

import ImageUpload from '../../shared/ImageUpload'
import { useDomainErrors } from '../../shared/errorHandling'
import useInvalidateQueries from '../../useInvalidateQueries'
import { useTranslation, Trans } from '../../i18n'

const useStyles = makeStyles({
  dropzone: {
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, .1)',
    padding: '1em',
    borderRadius: 5,
    cursor: 'pointer',
  },
})

export function MapImage({
  map: initialMap,
  editable,
  sessionService,
  sessionId,
}) {
  const classes = useStyles()
  const { setError } = useDomainErrors()
  const invalidateQueries = useInvalidateQueries()
  const [map, setMap] = useState(() => initialMap)
  const { t } = useTranslation()

  const upload = useCallback(
    async (file, previewUrl) => {
      try {
        const result = await sessionService.uploadMap(file, sessionId)
        if (result.ok) {
          setMap(previewUrl)
          invalidateQueries(['session', sessionId])
        }
      } catch (e) {
        setError(e)
      }
    },
    [sessionId, sessionService, setError, invalidateQueries],
  )

  if (map) {
    return (
      <Grid container justifyContent="center">
        <img
          alt={t('sessionMap.galaxy')}
          src={map}
          style={{ maxWidth: '86vw' }}
        />
      </Grid>
    )
  }

  if (!editable) {
    return (
      <Grid item>
        <div className={classes.dropzone}>
          <MapIcon style={{ fontSize: 60 }} />
          <p>
            <Trans i18nKey="sessionMap.none" />
          </p>
        </div>
      </Grid>
    )
  }

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
