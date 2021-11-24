import { Helmet } from 'react-helmet'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Route, Switch } from 'react-router-dom'

import * as factions from '../gameInfo/factions'
import { getFactionCheatSheetPath } from '../gameInfo/factions'
import FullscreenButton, { HideInFullscreen } from '../Fullscreen'
import { SESSION_VIEW_ROUTES } from '../shared/constants'

import useRealTimeSession from './useRealTimeSession'
import Overview from './Overview'
import ShuffleFactionsButton from './ShuffleFactionsButton'
import ShareButton from './ShareButton'
import Map from './Map'
import SessionNavigation from './SessionNavigation'
import DetailsForm from './DetailsForm'
import LockForEdit from './LockForEdit'
import { Timeline } from './Timeline'

const useStyles = makeStyles({
  header: {
    marginBottom: '2em',
  },
})

function SessionView({
  sessionService,
  editable,
  session,
  shuffleFactions,
  setFactions,
  updateFactionPoints,
}) {
  useRealTimeSession(session.id)
  const classes = useStyles()

  const sortedPoints = [...session.points]
  sortedPoints.sort((a, b) => b.points - a.points)
  const winningFaction = sortedPoints[0].faction

  return (
    <>
      <Helmet>
        <title>{`TI4 Companion session- ${session.factions.length} players - 10VP`}</title>
        <meta
          content={sortedPoints
            .map(
              ({ faction, points }) =>
                `${factions.getData(faction).name}(${points}vp)`,
            )
            .join(', ')}
          name="description"
        />

        <meta
          content={`TI4 Companion session - ${session.factions.length} players - 10VP`}
          property="og:title"
        />
        <meta
          content={sortedPoints
            .map(
              ({ faction, points }) =>
                `${factions.getData(faction).name}(${points}vp)`,
            )
            .join(', ')}
          property="og:description"
        />
        <meta
          content={`${window.location.origin}${getFactionCheatSheetPath(
            winningFaction,
          )}`}
          property="og:image"
        />
      </Helmet>

      <HideInFullscreen>
        <Grid className={classes.header} container>
          <Grid item xs={8}>
            <SessionNavigation />
          </Grid>
          <Grid container item justifyContent="flex-end" xs={4}>
            <FullscreenButton service={sessionService} />
            {editable && (
              <ShuffleFactionsButton
                factions={session.factions}
                session={session}
                setFactions={(factionsToSet) =>
                  setFactions(session.id, factionsToSet)
                }
                shuffleFactions={() => shuffleFactions(session.id)}
              />
            )}
            <ShareButton editable={editable} session={session} />
          </Grid>
        </Grid>
      </HideInFullscreen>

      <LockForEdit session={session} />

      <Switch>
        <Route exact path={SESSION_VIEW_ROUTES.map}>
          <Map
            editable={editable}
            session={session}
            sessionService={sessionService}
          />
        </Route>
        <Route exact path={SESSION_VIEW_ROUTES.details}>
          <DetailsForm disabled={!editable} session={session} />
        </Route>
        <Route exact path={SESSION_VIEW_ROUTES.timeline}>
          <Timeline session={session} sessionService={sessionService} />
        </Route>
        <Route exact path={SESSION_VIEW_ROUTES.main}>
          <Overview
            editable={editable}
            session={session}
            updateFactionPoints={updateFactionPoints}
          />
        </Route>
      </Switch>
    </>
  )
}

export default SessionView

export * from './SessionProvider'
