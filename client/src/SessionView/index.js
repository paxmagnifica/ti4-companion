import { useCallback, useRef } from 'react'
import { Helmet } from 'react-helmet'
import {
  Grid,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  useRouteMatch,
  Route,
  Switch,
} from 'react-router-dom'

import * as factions from '../gameInfo/factions'
import { getFactionCheatSheetPath } from '../gameInfo/factions'

import useRealTimeSession from './useRealTimeSession'
import Overview from './Overview'
import ShuffleFactionsButton from './ShuffleFactionsButton'
import ShareButton from './ShareButton'
import Map from './Map'
import SessionNavigation from './SessionNavigation'
import DetailsForm from './DetailsForm'
import FullscreenButton, { HideInFullscreen } from '../Fullscreen'

const useStyles = makeStyles({
  header: {
    marginBottom: '2em',
  },
})

function SessionView({
  session,
  shuffleFactions,
  setFactions,
  updateFactionPoints,
}) {
  useRealTimeSession(session.id)
  const classes = useStyles()
  const { path } = useRouteMatch('/:sessionId')

  const sortedPoints = [...session.points]
  sortedPoints.sort((a, b) => b.points - a.points)
  const winningFaction = sortedPoints[0].faction

  return <>
    <Helmet>
      <title>{`TI4 Companion session- ${session.factions.length} players - 10VP`}</title>
      <meta name="description" content={sortedPoints.map(({ faction, points }) => `${factions.getData(faction).name}(${points}vp)`).join(', ')} />

      <meta property="og:title" content={`TI4 Companion session - ${session.factions.length} players - 10VP`} />
      <meta property="og:description" content={sortedPoints.map(({ faction, points }) => `${factions.getData(faction).name}(${points}vp)`).join(', ')} />
      <meta property="og:image" content={`${window.location.origin}${getFactionCheatSheetPath(winningFaction)}`} />
    </Helmet>

    <HideInFullscreen>
      <Grid container className={classes.header}>
        <Grid item xs={8}>
          <SessionNavigation
            sessionId={session.id}
          />
        </Grid>
        <Grid item container xs={4} justifyContent="flex-end">
          <FullscreenButton />
          <ShuffleFactionsButton
            factions={session.factions}
            shuffleFactions={() => shuffleFactions(session.id)}
            setFactions={factions => setFactions(session.id, factions)}
          />
          <ShareButton id={session.id} />
        </Grid>
      </Grid>
    </HideInFullscreen>

    <Switch>
      <Route exact path={path}>
        <Overview
          session={session}
          shuffleFactions={shuffleFactions}
          setFactions={setFactions}
          updateFactionPoints={updateFactionPoints}
        />
      </Route>
      <Route exact path={`${path}/map`}>
        <Map
          session={session}
        />
      </Route>
      <Route exact path={`${path}/details`}>
        <DetailsForm
          session={session}
        />
      </Route>
    </Switch>
  </>
}

export default SessionView

export * from './SessionProvider'
