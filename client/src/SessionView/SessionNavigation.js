import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import {
  Menu,
  Assistant,
  Map as MapIcon,
  Details,
  ChevronRight,
  ChevronLeft,
} from '@material-ui/icons'
import { useTheme, makeStyles, withStyles } from '@material-ui/core/styles'
import { useHistory, useRouteMatch, generatePath } from 'react-router-dom'

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
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />)

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
}))((props) => <Tab disableRipple {...props} />)

const VIEW = {
  overview: 0,
  map: 1,
  details: 2,
}

const useStyles = makeStyles((theme) => ({
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    justifyContent: 'flex-end',
  },
}))

function SessionNavigation() {
  const { t } = useTranslation()
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

    return { secret, ...otherParams }
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

  const go = useMemo(
    () => ({
      [VIEW.overview]: () =>
        history.push(generatePath(SESSION_VIEW_ROUTES.main, sanitizedParams)),
      [VIEW.map]: () =>
        history.push(generatePath(SESSION_VIEW_ROUTES.map, sanitizedParams)),
      [VIEW.details]: () =>
        history.push(
          generatePath(SESSION_VIEW_ROUTES.details, sanitizedParams),
        ),
    }),
    [history, sanitizedParams],
  )
  const handleChange = useCallback((event, newView) => go[newView](), [go])
  const goAndCloseDrawer = useCallback(
    (view) => {
      go[view]()
      setDrawerOpen(false)
    },
    [go],
  )

  if (small) {
    return (
      <>
        <Drawer
          anchor="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={() => setDrawerOpen(false)}>
              {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem button onClick={() => goAndCloseDrawer(VIEW.overview)}>
              <ListItemIcon>
                <Assistant />
              </ListItemIcon>
              <ListItemText primary={t('sessionView.nav.overview')} />
            </ListItem>
            <ListItem button onClick={() => goAndCloseDrawer(VIEW.map)}>
              <ListItemIcon>
                <MapIcon />
              </ListItemIcon>
              <ListItemText primary={t('sessionView.nav.map')} />
            </ListItem>
            <ListItem button onClick={() => goAndCloseDrawer(VIEW.details)}>
              <ListItemIcon>
                <Details />
              </ListItemIcon>
              <ListItemText primary={t('sessionView.nav.details')} />
            </ListItem>
          </List>
        </Drawer>
        <IconButton edge="start" onClick={() => setDrawerOpen(true)}>
          <Menu />
        </IconButton>
      </>
    )
  }

  return (
    <StyledTabs onChange={handleChange} value={view}>
      <StyledTab
        icon={<Assistant />}
        label={t('sessionView.nav.overview')}
        title={t('sessionView.nav.overview')}
        value={VIEW.overview}
      />
      <StyledTab
        icon={<MapIcon />}
        label={t('sessionView.nav.map')}
        title={t('sessionView.nav.map')}
        value={VIEW.map}
      />
      <StyledTab
        icon={<Details />}
        label={t('sessionView.nav.details')}
        title={t('sessionView.nav.details')}
        value={VIEW.details}
      />
    </StyledTabs>
  )
}

export default SessionNavigation
