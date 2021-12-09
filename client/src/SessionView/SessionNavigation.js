import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
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
  Timeline,
} from '@material-ui/icons'
import { useTheme, makeStyles } from '@material-ui/core/styles'
import { useHistory, useRouteMatch, generatePath } from 'react-router-dom'

import { Tab, Tabs } from '../components/navigation'
import useSmallViewport from '../shared/useSmallViewport'
import { SESSION_VIEW_ROUTES } from '../shared/constants'

const VIEW = {
  overview: 0,
  map: 1,
  details: 2,
  timeline: 3,
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
  const timelineRoute = useRouteMatch(SESSION_VIEW_ROUTES.timeline)
  const sanitizedParams = useMemo(() => {
    const { secret, ...otherParams } = params

    if (Object.keys(SESSION_VIEW_ROUTES).includes(secret)) {
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

    if (timelineRoute?.isExact) {
      return VIEW.timeline
    }

    return VIEW.overview
  }, [mapRoute, detailsRoute, timelineRoute])

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
      [VIEW.timeline]: () =>
        history.push(
          generatePath(SESSION_VIEW_ROUTES.timeline, sanitizedParams),
        ),
    }),
    [history, sanitizedParams],
  )
  const handleChange = useCallback((event, newView) => go[newView](), [go])
  const goAndCloseDrawer = useCallback(
    (goToView) => {
      go[goToView]()
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
            <ListItem button onClick={() => goAndCloseDrawer(VIEW.timeline)}>
              <ListItemIcon>
                <Timeline />
              </ListItemIcon>
              <ListItemText primary={t('sessionView.nav.timeline')} />
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
    <Tabs onChange={handleChange} value={view}>
      <Tab
        icon={<Assistant />}
        label={t('sessionView.nav.overview')}
        title={t('sessionView.nav.overview')}
        value={VIEW.overview}
      />
      <Tab
        icon={<MapIcon />}
        label={t('sessionView.nav.map')}
        title={t('sessionView.nav.map')}
        value={VIEW.map}
      />
      <Tab
        icon={<Details />}
        label={t('sessionView.nav.details')}
        title={t('sessionView.nav.details')}
        value={VIEW.details}
      />
      <Tab
        icon={<Timeline />}
        label={t('sessionView.nav.timeline')}
        title={t('sessionView.nav.timeline')}
        value={VIEW.timeline}
      />
    </Tabs>
  )
}

export default SessionNavigation
