import { useState, useCallback, useMemo } from 'react'
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

const useStyles = makeStyles({
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
})

function FactionNutshells({
  factionsList,
  classes,
  setFaction,
  setFactionDialogOpen,
}) {
  const { t } = useTranslation()

  return factionsList.map((faction) => {
    const factionData = factions.getData(faction)
    const factionName = t(`factions.${faction}.name`)

    return (
      <Grid key={factionData.key} item sm={6} xs={12}>
        <Card className={classes.factionCard}>
          <CardHeader
            avatar={<Avatar alt={factionName} src={factionData.image} />}
            title={factionName}
          />
          <CardMedia
            className={classes.media}
            image={getFactionCheatSheetPath(factionData.key)}
            onClick={() => {
              setFaction(factionData.key)
              setFactionDialogOpen((open) => !open)
            }}
            title={factionName}
          />
          <CardActions disableSpacing>
            <Tooltip placement="top" title={t('sessionView.overview.goToWiki')}>
              <IconButton
                aria-label={t('sessionView.overview.goToWiki')}
                className={classes.factionCardIcon}
                href={`https://twilight-imperium.fandom.com/wiki/${encodeURIComponent(
                  factionName,
                )}`}
                target="about:blank"
              >
                <LocalLibrary />
              </IconButton>
            </Tooltip>
            <Tooltip
              placement="top"
              title={t('sessionView.overview.openOriginal')}
            >
              <IconButton
                aria-label={t('sessionView.overview.openOriginal')}
                className={classes.factionCardIcon}
                href={getFactionCheatSheetPath(factionData.key)}
                target="about:blank"
              >
                <PhotoLibrary />
              </IconButton>
            </Tooltip>
          </CardActions>
        </Card>
      </Grid>
    )
  })
}

const justifyBasedOnPublicObjectives = ({ editable, objectives }) => {
  const whenToStretch = editable ? 5 : 6

  return objectives.length > whenToStretch ? 'stretch' : 'center'
}

function Overview({ editable, session, updateFactionPoints }) {
  const classes = useStyles()
  const [factionDialogOpen, setFactionDialogOpen] = useState(false)
  const [faction, setFaction] = useState(null)
  const { fullscreen } = useFullscreen()
  const { t } = useTranslation()

  const updateFactionPointsInSession = useCallback(
    (factionToUpdate, points) =>
      updateFactionPoints({
        sessionId: session.id,
        faction: factionToUpdate,
        points,
      }),
    [session.id, updateFactionPoints],
  )

  const justifyLayout = useMemo(
    () =>
      justifyBasedOnPublicObjectives({
        editable,
        objectives: session.objectives,
      }),
    [editable, session.objectives],
  )

  return (
    <>
      <HideInFullscreen>
        <Grid
          alignItems="center"
          className={classes.root}
          container
          justifyContent="center"
          spacing={4}
        >
          <Grid item style={{ textAlign: 'right' }} xs={12}>
            {t('sessionView.overview.sessionStart')}{' '}
            {new Date(session.createdAt).toLocaleString()}
          </Grid>
        </Grid>
      </HideInFullscreen>
      <Grid
        alignItems="center"
        className={clsx(classes.root, { [classes.fullscreen]: fullscreen })}
        container
        direction="column"
        justifyContent={justifyLayout}
        spacing={4}
      >
        <Grid className={clsx({ [classes.fullWidth]: fullscreen })} item>
          <VictoryPoints
            editable={editable}
            factions={session.factions}
            onChange={updateFactionPointsInSession}
            points={session.points}
            target={session.vpCount}
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
          alignItems="center"
          className={classes.root}
          container
          justifyContent="center"
          spacing={4}
        >
          <FactionNutshells
            classes={classes}
            factionsList={session.factions}
            setFaction={setFaction}
            setFactionDialogOpen={setFactionDialogOpen}
          />
        </Grid>
        <Dialog
          maxWidth="lg"
          onClose={() => setFactionDialogOpen(false)}
          open={factionDialogOpen}
        >
          {faction && (
            <img alt={faction} src={getFactionCheatSheetPath(faction)} />
          )}
        </Dialog>
      </HideInFullscreen>
    </>
  )
}

export default Overview
