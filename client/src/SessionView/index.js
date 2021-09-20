import { useState } from 'react'
import { Helmet } from 'react-helmet'
import {
  Grid,
  Tab,
  Tabs,
} from '@material-ui/core'
import { Assistant, Map } from '@material-ui/icons'
import { makeStyles, withStyles } from '@material-ui/core/styles'

import * as factions from '../gameInfo/factions'
import { getFactionCheatSheetPath } from '../gameInfo/factions'

import useRealTimeSession from './useRealTimeSession'
import Overview from './Overview'
import ShuffleFactionsButton from './ShuffleFactionsButton'
import ShareButton from './ShareButton'

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 70,
      width: '100%',
      backgroundColor: '#fff',
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: '#fff',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    minHeight: 'unset',
    marginRight: theme.spacing(1),
    '&:focus': {
      opacity: 1,
    },
  },
  wrapper: {
    flexDirection: 'row',
  },
}))((props) => <Tab disableRipple {...props} />);

const useStyles = makeStyles({
  header: {
    marginBottom: '2em',
  },
})

const VIEW = {
  overview: 0,
  map: 1,
}

function SessionView({
  session,
  shuffleFactions,
  setFactions,
  updateFactionPoints,
  updateObjectives,
}) {
  useRealTimeSession(session.id)
  const classes = useStyles()

  const sortedPoints = [...session.points]
  sortedPoints.sort((a, b) => b.points - a.points)
  const winningFaction = sortedPoints[0].faction

  const [view, setView] = useState(VIEW.overview);

  const handleChange = (event, newView) => {
    setView(newView);
  };

  return <>
    <Helmet>
      <title>{`TI4 Companion session- ${session.factions.length} players - 10VP`}</title>
      <meta name="description" content={sortedPoints.map(({ faction, points }) => `${factions.getData(faction).name}(${points}vp)`).join(', ')} />

      <meta property="og:title" content={`TI4 Companion session - ${session.factions.length} players - 10VP`} />
      <meta property="og:description" content={sortedPoints.map(({ faction, points }) => `${factions.getData(faction).name}(${points}vp)`).join(', ')} />
      <meta property="og:image" content={`${window.location.origin}${getFactionCheatSheetPath(winningFaction)}`} />
    </Helmet>

    <Grid container className={classes.header}>
      <Grid item xs={6}>
        <StyledTabs value={view} onChange={handleChange} aria-label="styled tabs example">
          <StyledTab icon={<Assistant />} label="Overview" title="Overview" />
          <StyledTab icon={<Map />} label="Map" title="Map" />
        </StyledTabs>
      </Grid>
      <Grid item container xs={6} justifyContent="flex-end">
        <ShuffleFactionsButton
          factions={session.factions}
          shuffleFactions={() => shuffleFactions(session.id)}
          setFactions={factions => setFactions(session.id, factions)}
        />
        <ShareButton id={session.id} />
      </Grid>
    </Grid>

    <div hidden={view !== VIEW.overview }>
      <Overview
        session={session}
        shuffleFactions={shuffleFactions}
        setFactions={setFactions}
        updateFactionPoints={updateFactionPoints}
      />
    </div>
    <div hidden={view !== VIEW.map }>
      <p>hello map here</p>
    </div>
  </>
}

export default SessionView

export * from './SessionProvider'
