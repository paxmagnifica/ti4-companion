import {
  Grid,
} from '@material-ui/core'
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

function Map({
  editable,
  session,
}) {
  const { t } = useTranslation()
  const classes = useStyles()

  if (session.map) {
    return <Grid justifyContent="center" container >
      <img
        style={{ maxWidth: '86vw' }}
        src={session.map}
        alt={t('sessionMap.map')}
      />
    </Grid>
  }

  return <Grid
    container
    alignItems='center'
    justifyContent='center'
    direction='column'
    spacing={2}
  >
    {editable
      ? <MapUpload sessionId={session.id} />
      : <Grid item>
        <div
          className={classes.dropzone}
        >
          <MapIcon style={{ fontSize: 60 }}/>
          <p><Trans i18nKey='sessionMap.none'/></p>
        </div>
      </Grid>
    }
  </Grid>
}

export default Map
