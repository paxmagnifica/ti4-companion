import { CardMedia, Avatar, Card, CardHeader, CardActions, IconButton, Grid } from '@material-ui/core'
import { LocalLibrary } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import * as factions from './gameInfo/factions'

const useStyles = makeStyles({
  media: {
    height: 0,
    paddingTop: '71.25%',
  },
})

function SessionView({
  session
}) {
  const classes = useStyles()

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
            <CardMedia
              className={classes.media}
              title={factionData.name}
              image={`/factionCheatsheets/${factionData.key.toLowerCase()}.png`}
            />
            <CardActions>
              <IconButton
                aria-label="go to wiki"
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
