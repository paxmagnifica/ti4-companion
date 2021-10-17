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
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  return factionsList.map(faction => {
    const factionData = factions.getData(faction)
    const factionName = t(`factions.${faction}.name`)

    return <Grid item xs={12} sm={6} key={factionData.key}>
      <Card className={classes.factionCard}>
        <CardHeader
          avatar={<Avatar alt={factionName} src={factionData.image}/>}
          title={factionName}
        />
        <CardMedia
          onClick={() => {
            setFaction(factionData.key)
            setFactionDialogOpen(open => !open)
          }}
          className={classes.media}
          title={factionName}
          image={getFactionCheatSheetPath(factionData.key)}
        />
        <CardActions disableSpacing>
          <Tooltip title={t('sessionView.overview.goToWiki')} placement="top">
            <IconButton
              className={classes.factionCardIcon}
              aria-label={t('sessionView.overview.goToWiki')}
              href={`https://twilight-imperium.fandom.com/wiki/${encodeURIComponent(factionName)}`}
              target="about:blank"
            >
              <LocalLibrary />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('sessionView.overview.openOriginal')} placement="top">
            <IconButton
              className={classes.factionCardIcon}
              aria-label={t('sessionView.overview.openOriginal')}
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
  editable,
  session,
  shuffleFactions,
  setFactions,
  updateFactionPoints,
}) {
  const classes = useStyles()
  const [factionDialogOpen, setFactionDialogOpen] = useState(false)
  const [faction, setFaction] = useState(null)
  const { fullscreen } = useFullscreen()
  const { t } = useTranslation()

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
          {t('sessionView.overview.sessionStart', { date: new Date(session.createdAt).toLocaleDateString(), time: new Date(session.createdAt).toLocaleTimeString() })},
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
          editable={editable}
          onChange={updateFactionPointsInSession}
          points={session.points}
          factions={session.factions}
        />
      </Grid>
      <Grid item>
        <PublicObjectives
          editable={editable}
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
