import { useCallback, useMemo, useState } from 'react'
import {
  Tab,
  Tabs,
  Drawer,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import { Menu, Assistant, Map as MapIcon, Details, ChevronRight, ChevronLeft } from '@material-ui/icons'
import { useTheme, makeStyles, withStyles } from '@material-ui/core/styles'
import {
  useHistory,
  useRouteMatch,
  generatePath,
} from 'react-router-dom'

import useSmallViewport from '../shared/useSmallViewport'
import { SESSION_VIEW_ROUTES } from '../shared/constants'

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

const useStyles = makeStyles(theme => ({
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    justifyContent: 'flex-end',
  },
}))

function SessionNavigation() {
  const [drawerOpen, setDrawerOpen] = useState()
  const classes = useStyles()
  const theme = useTheme()
  const small = useSmallViewport()
  const { params } = useRouteMatch(SESSION_VIEW_ROUTES.main)
  const mapRoute = useRouteMatch(SESSION_VIEW_ROUTES.map)
  const detailsRoute = useRouteMatch(SESSION_VIEW_ROUTES.details)
  const sanitizedParams = useMemo(() => {
    const { secret, ...otherParams } = params

    if (['map', 'details'].includes(secret)) {
      return otherParams
    }

    return { secret, ...otherParams}
  }, [params])
  const history = useHistory()
  const view = useMemo(() => {
    if (mapRoute?.isExact) {
      return VIEW.map
    }

    if (detailsRoute?.isExact) {
      return VIEW.details
    }

    return VIEW.overview
  }, [mapRoute, detailsRoute])

  const go = useMemo(() => ({
    [VIEW.overview]: () => history.push(generatePath(SESSION_VIEW_ROUTES.main, sanitizedParams)),
    [VIEW.map]: () => history.push(generatePath(SESSION_VIEW_ROUTES.map, sanitizedParams)),
    [VIEW.details]: () => history.push(generatePath(SESSION_VIEW_ROUTES.details, sanitizedParams)),
  }), [history, sanitizedParams])
  const handleChange = useCallback((event, newView) => go[newView](), [go]);
  const goAndCloseDrawer = useCallback(view => {
    go[view]()
    setDrawerOpen(false)
  }, [go])

  if (small) {
    return <>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        anchor='left'
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={() => setDrawerOpen(false)}>
            {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button onClick={() => goAndCloseDrawer(VIEW.overview)}>
            <ListItemIcon><Assistant /></ListItemIcon>
            <ListItemText primary="Overview" />
          </ListItem>
          <ListItem button onClick={() => goAndCloseDrawer(VIEW.map)}>
            <ListItemIcon><MapIcon /></ListItemIcon>
            <ListItemText primary="Map" />
          </ListItem>
          <ListItem button onClick={() => goAndCloseDrawer(VIEW.details)}>
            <ListItemIcon><Details /></ListItemIcon>
            <ListItemText primary="Details" />
          </ListItem>
        </List>
      </Drawer>
      <IconButton
        aria-label="open drawer"
        onClick={() => setDrawerOpen(true)}
        edge="start"
      >
        <Menu />
      </IconButton>
    </>
  }

  return <StyledTabs value={view} onChange={handleChange} aria-label="styled tabs example">
    <StyledTab value={VIEW.overview} icon={<Assistant />} label="Overview" title="Overview" />
    <StyledTab value={VIEW.map} icon={<MapIcon />} label="Map" title="Map" />
    <StyledTab value={VIEW.details} icon={<Details />} label="Details" title="Details" />
  </StyledTabs>
}

export default SessionNavigation
