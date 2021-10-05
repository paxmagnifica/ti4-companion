import {
  Grid,
} from '@material-ui/core'

import MapUpload from './MapUpload'

function Map({
  editable,
  session,
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

  return editable
    ? <MapUpload sessionId={session.id} />
    : <p>no map yet</p>
}

export default Map
