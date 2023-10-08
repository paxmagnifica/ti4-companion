import { useCallback } from 'react'
import clsx from 'clsx'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { HideInFullscreen, useFullscreen } from '../../../Fullscreen'
import { SessionNutshell } from '../SessionNutshell'

import VictoryPoints from './VictoryPoints'
import PublicObjectives from './PublicObjectives'
import FactionNutshells from './FactionNutshells'
import { PointControls } from './PointControls'

const useStyles = makeStyles({
  root: {
    color: 'white',
  },
  fullscreen: {
    height: 'calc(100vh - 64px)', // TODO bad hack for header height, use theme, I think
  },
  vpContainer__fullscreen: {
    width: '100%',
    paddingTop: '0 !important',
    paddingBottom: '0 !important',
    marginTop: '-6vh',
  },
  poContainer__fullscreen: {
    paddingTop: '0 !important',
    paddingBottom: '0 !important',
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

export function Session({
  editable,
  session,
  updateFactionPoints,
  children: additionalContent,
}) {
  const classes = useStyles()
  const { fullscreen } = useFullscreen()

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
        <SessionNutshell />
      </HideInFullscreen>
      <Grid
        alignItems="center"
        className={clsx(classes.root, { [classes.fullscreen]: fullscreen })}
        container
        direction="column"
        justifyContent="center"
        spacing={4}
      >
        <Grid
          className={clsx({
            [classes.vpContainer__fullscreen]: fullscreen,
          })}
          item
        >
          <VictoryPoints
            editable={false}
            factions={session.factions}
            onChange={updateFactionPointsInSession}
            points={session.points}
            target={session.vpCount}
          />
        </Grid>
        <Grid
          className={clsx({
            [classes.poContainer__fullscreen]: fullscreen,
          })}
          item
        >
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
          container
          direction="column"
          justifyContent="center"
          style={{ gridRowGap: '2em' }}
        >
          {additionalContent}
          {!session.locked && (
            <PointControls
              editable={editable}
              objectives={session.objectives}
              players={session.players}
              points={session.points}
              updatePoints={updateFactionPointsInSession}
            />
          )}
          <Grid
            alignItems="center"
            className={classes.root}
            container
            justifyContent="center"
            spacing={4}
          >
            <FactionNutshells
              classes={classes}
              players={session.players}
              sessionId={session.id}
              showTablePosition={Boolean(session.setup.options?.tablePick)}
              wasDrafted={session.setup.setupType === 'draft'}
            />
          </Grid>
        </Grid>
      </HideInFullscreen>
    </>
  )
}
