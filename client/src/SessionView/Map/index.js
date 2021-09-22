import {
  Grid,
} from '@material-ui/core'

import MapUpload from './MapUpload'

function Map({
  session
}) {
  if (session.map) {
    return <Grid justifyContent="center" container >
      <img
        style={{ maxWidth: '86vw' }}
        src={session.map}
        alt="TI4 map"
      />
    </Grid>
  }

  return <MapUpload sessionId={session.id} />
}

export default Map
