import { useState, useCallback } from 'react'
import clsx from 'clsx'
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

import * as factions from '../../gameInfo/factions'
import { getFactionCheatSheetPath } from '../../gameInfo/factions'
import { HideInFullscreen, useFullscreen } from '../../Fullscreen'

import VictoryPoints from './VictoryPoints'
import PublicObjectives from './PublicObjectives'

const useStyles = makeStyles(theme => ({
  root: {
    color: 'white',
  },
  fullscreen: {
    height: 'calc(100vh - 64px)', // TODO bad hack for header height, use theme, I think
  },
  fullWidth: {
    width: '100%',
  },
  factionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
  },
  factionCardIcon: {
    color: 'white',
  },
  media: {
    height: 0,
    paddingTop: '71.25%',
    cursor: 'pointer',
  },
}))

function FactionNutshells({
  factionsList,
  classes,
  setFaction,
  setFactionDialogOpen,
}) {
  return factionsList.map(faction => {
    const factionData = factions.getData(faction)

    return <Grid item xs={12} sm={6} key={factionData.key}>
      <Card className={classes.factionCard}>
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
              className={classes.factionCardIcon}
              aria-label="go to wiki"
              href={`https://twilight-imperium.fandom.com/wiki/${encodeURIComponent(factionData.name)}`}
              target="about:blank"
            >
              <LocalLibrary />
            </IconButton>
          </Tooltip>
          <Tooltip title="open original image" placement="top">
            <IconButton
              className={classes.factionCardIcon}
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
  })
}

function Overview({
  session,
  shuffleFactions,
  setFactions,
  updateFactionPoints,
}) {
  const classes = useStyles()
  const [factionDialogOpen, setFactionDialogOpen] = useState(false)
  const [faction, setFaction] = useState(null)
  const { fullscreen } = useFullscreen()

  const updateFactionPointsInSession = useCallback((faction, points) => updateFactionPoints({
    sessionId: session.id,
    faction,
    points
  }), [session.id, updateFactionPoints])

  return <>
    <HideInFullscreen>
      <Grid
        className={classes.root}
        container
        alignItems="center"
        justifyContent="center"
        spacing={4}
      >
        <Grid item xs={12} style={{ textAlign: 'right' }}>
          session from: {new Date(session.createdAt).toLocaleDateString()} {new Date(session.createdAt).toLocaleTimeString()}
        </Grid>
      </Grid>
    </HideInFullscreen>
    <Grid
      className={clsx(classes.root, { [classes.fullscreen]: fullscreen })}
      container
      alignItems="center"
      justifyContent="center"
      direction='column'
      spacing={4}
    >
      <Grid item className={clsx({ [classes.fullWidth]: fullscreen })}>
        <VictoryPoints
          onChange={updateFactionPointsInSession}
          points={session.points}
          factions={session.factions}
        />
      </Grid>
      <Grid item>
        <PublicObjectives
          session={session}
          updateFactionPoints={updateFactionPoints}
        />
      </Grid>
    </Grid>
    <HideInFullscreen>
      <Grid
        className={classes.root}
        container
        alignItems="center"
        justifyContent="center"
        spacing={4}
      >
        <FactionNutshells
          factionsList={session.factions}
          classes={classes}
          setFaction={setFaction}
          setFactionDialogOpen={setFactionDialogOpen}
        />
      </Grid>
      <Dialog
        open={factionDialogOpen}
        onClose={() => setFactionDialogOpen(false)}
        maxWidth='lg'
      >
        {faction && <img src={getFactionCheatSheetPath(faction)} alt={faction} />}
      </Dialog>
    </HideInFullscreen>
  </>
}

export default Overview
