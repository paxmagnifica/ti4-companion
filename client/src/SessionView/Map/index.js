import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Map as MapIcon } from '@material-ui/icons'
import { useTranslation, Trans } from 'react-i18next'

import MapUpload from './MapUpload'

const useStyles = makeStyles({
  dropzone: {
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, .1)',
    padding: '1em',
    borderRadius: 5,
    cursor: 'pointer',
  },
})

function Map({ editable, session, sessionService }) {
  const { t } = useTranslation()
  const classes = useStyles()

  if (session.map) {
    return (
      <Grid container justifyContent="center">
        <img
          alt={t('sessionMap.map')}
          src={session.map}
          style={{ maxWidth: '86vw' }}
        />
      </Grid>
    )
  }

  return (
    <Grid
      alignItems="center"
      container
      direction="column"
      justifyContent="center"
      spacing={2}
    >
      {editable ? (
        <MapUpload sessionId={session.id} sessionService={sessionService} />
      ) : (
        <Grid item>
          <div className={classes.dropzone}>
            <MapIcon style={{ fontSize: 60 }} />
            <p>
              <Trans i18nKey="sessionMap.none" />
            </p>
          </div>
        </Grid>
      )}
    </Grid>
  )
}

export default Map
