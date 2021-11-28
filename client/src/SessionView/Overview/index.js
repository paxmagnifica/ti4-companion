import { useState, useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { Dialog, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

import { getFactionCheatSheetPath } from '../../gameInfo/factions'
import { HideInFullscreen, useFullscreen } from '../../Fullscreen'

import VictoryPoints from './VictoryPoints'
import PublicObjectives from './PublicObjectives'
import FactionNutshells from './FactionNutshells'

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
        justifyContent="center"
        spacing={4}
      >
        <Grid className={clsx({ [classes.fullWidth]: fullscreen })} item>
          <VictoryPoints
            editable={editable && !fullscreen}
            factions={session.factions}
            onChange={updateFactionPointsInSession}
            points={session.points}
            target={session.vpCount}
          />
        </Grid>
        <Grid item>
          <PublicObjectives
            editable={editable && !fullscreen}
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
