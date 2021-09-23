import { useCallback, useMemo } from 'react'
import {
  Tab,
  Tabs,
} from '@material-ui/core'
import { Assistant, Map as MapIcon, Details } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import {
  useLocation,
  useHistory,
  useRouteMatch,
} from 'react-router-dom'

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

const VIEW = {
  overview: 0,
  map: 1,
  details: 2,
}

function SessionNavigation({ sessionId }) {
  const { isExact } = useRouteMatch()
  const location = useLocation()
  const history = useHistory()
  const view = useMemo(() => {
    if (isExact) {
      return VIEW.overview
    }

    if (location.pathname.endsWith('map') || location.pathname.endsWith('map/')) {
      return VIEW.map
    }

    return VIEW.details
  }, [isExact, location])

  const handleChange = useCallback((event, newView) => {
    const go = {
      [VIEW.overview]: () => history.push(`/${sessionId}`),
      [VIEW.map]: () => history.push(`/${sessionId}/map`),
      [VIEW.details]: () => history.push(`/${sessionId}/details`),
    }

    go[newView]()
  }, [sessionId, history]);

  return <StyledTabs value={view} onChange={handleChange} aria-label="styled tabs example">
    <StyledTab value={VIEW.overview} icon={<Assistant />} label="Overview" title="Overview" />
    <StyledTab value={VIEW.map} icon={<MapIcon />} label="Map" title="Map" />
    <StyledTab value={VIEW.details} icon={<Details />} label="Details" title="Details" />
  </StyledTabs>
}

export default SessionNavigation
