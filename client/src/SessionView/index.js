import { useState } from 'react'
import {
  Avatar,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Dialog,
  Grid,
  IconButton,
  Tooltip,
} from '@material-ui/core'
import { LocalLibrary, PhotoLibrary } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import * as factions from '../gameInfo/factions'

import ShuffleFactionsButton from './ShuffleFactionsButton'
import ShareButton from './ShareButton'

const useStyles = makeStyles(theme => ({
  media: {
    height: 0,
    paddingTop: '71.25%',
    cursor: 'pointer',
  },
}))

const getFactionCheatSheetPath = factionKey => `/factionCheatsheets/${factionKey.toLowerCase()}.png`

function SessionView({
  session,
  shuffleFactions,
  setFactions,
}) {
  const classes = useStyles()
  const [factionDialogOpen, setFactionDialogOpen] = useState(false)
  const [faction, setFaction] = useState(null)

  return <>
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      spacing={4}
    >
      {session.remote ? <Grid item xs={12}>you are looking at a remote session!!</Grid> : null}
      <Grid item xs={6}>
        session from: {new Date(session.createdAt).toLocaleDateString()} {new Date(session.createdAt).toLocaleTimeString()}
      </Grid>
      <Grid item container xs={6} justifyContent="flex-end">
        {
          session.remote
            ? null
            : <ShuffleFactionsButton
              factions={session.factions}
              shuffleFactions={() => shuffleFactions(session.id)}
              setFactions={factions => setFactions(session.id)}
            />
        }
        <ShareButton id={session.id} />
      </Grid>
      {session.factions.map(faction => {
        const factionData = factions.getData(faction)

        return <Grid item xs={12} sm={6} key={factionData.key}>
          <Card>
            <CardHeader
              avatar={<Avatar alt={factionData.name} src={factionData.image}/>}
              title={factionData.name}
            />
            <CardMedia
              onClick={() => {
                setFaction(factionData.key)
                setFactionDialogOpen(open => !open)
              }}
              className={classes.media}
              title={factionData.name}
              image={getFactionCheatSheetPath(factionData.key)}
            />
            <CardActions disableSpacing>
              <Tooltip title="go to wiki" placement="top">
                <IconButton
                  aria-label="go to wiki"
                  href={`https://twilight-imperium.fandom.com/wiki/${encodeURIComponent(factionData.name)}`}
                  target="about:blank"
                >
                  <LocalLibrary />
                </IconButton>
              </Tooltip>
              <Tooltip title="open original image" placement="top">
                <IconButton
                  aria-label="open original image"
                  href={getFactionCheatSheetPath(factionData.key)}
                  target="about:blank"
                >
                  <PhotoLibrary />
                </IconButton>
              </Tooltip>
            </CardActions>
          </Card>
        </Grid>
      })}
    </Grid>
    <Dialog
      open={factionDialogOpen}
      onClose={() => setFactionDialogOpen(false)}
      maxWidth='lg'
    >
      {faction && <img src={getFactionCheatSheetPath(faction)} alt={faction} />}
    </Dialog>
  </>
}

export default SessionView

export * from './SessionProvider'
