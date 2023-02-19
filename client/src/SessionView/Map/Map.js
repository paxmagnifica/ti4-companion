import { Grid } from '@material-ui/core'

import { MapImage } from './MapImage'
import { MapLink } from './MapLink'

export function Map({ editable, session, sessionService }) {
  return (
    <Grid
      alignItems="center"
      container
      direction="column"
      justifyContent="center"
      spacing={4}
    >
      <MapLink
        editable={editable}
        link={session.mapLink}
        sessionId={session.id}
        sessionService={sessionService}
      />
      <MapImage
        editable={editable}
        map={session.map}
        sessionId={session.id}
        sessionService={sessionService}
      />
    </Grid>
  )
}
