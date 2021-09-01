import { Avatar, Card, CardHeader, CardActions, IconButton, Grid } from '@material-ui/core'
import { LocalLibrary } from '@material-ui/icons'

import * as factions from './gameInfo/factions'

function SessionView({
  session
}) {
  return <>
    <Grid container justifyContent="center" spacing={4}>
      {session.factions.map(faction => {
        const factionData = factions.getData(faction)

        return <Grid item xs={12} sm={6} key={factionData.key}>
          <Card>
            <CardHeader
              avatar={<Avatar alt={factionData.name} src={factionData.image}/>}
              title={factionData.name}
            />
            <CardActions>
              <IconButton
                aria-label="show wiki"
                href={`https://twilight-imperium.fandom.com/wiki/${encodeURIComponent(factionData.name)}`}
                target="about:blank"
              >
                <LocalLibrary />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      })}
    </Grid>
  </>
}

export default SessionView
