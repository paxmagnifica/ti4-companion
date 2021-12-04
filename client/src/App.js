import { useEffect, useCallback, useMemo, useReducer } from 'react'
import clsx from 'clsx'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Helmet } from 'react-helmet'
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core'
import {
  makeStyles,
  createTheme,
  ThemeProvider,
} from '@material-ui/core/styles'
import { useTranslation, Trans } from 'react-i18next'

import { getAllSessions } from './shared/persistence'
import homeIcon from './assets/icon.jpg'
import NewSession from './NewSession'
import SessionsList from './SessionsList'
import SessionView, { SessionProvider } from './SessionView'
import * as objectivesService from './objectivesService'
import { DispatchContext, StateContext, reducer, init } from './state'
import { SignalRConnectionProvider } from './signalR'
import KnowledgeBase from './KnowledgeBase'
import { useFullscreen } from './Fullscreen'
import i18nFactory from './i18n'
import LanguageSwitcher from './i18n/languageSwitcher'
import GitHubRibbon from './GitHubRibbon'
import config from './config'
import useInvalidateQueries from './useInvalidateQueries'
import { Footer } from './Footer'

i18nFactory()

const useStyles = makeStyles({
  fullWidth: {
    width: '100%',
    maxWidth: '100%',
  },
  title: {
    flexGrow: 1,
  },
})

function App() {
  const { t } = useTranslation()
  const classes = useStyles()
  const [state, dispatch] = useReducer(reducer, null, init)
  const { sessions } = state

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          type: 'dark',
        },
      }),
    [],
  )

  const { fullscreen, exitFullscreen } = useFullscreen()

  useEffect(() => {
    const allSessions = getAllSessions()
    dispatch({ type: 'LoadSessions', sessions: allSessions })

    const load = async () => {
      const objectives = await objectivesService.getAll()

      dispatch({ type: 'LoadObjectives', objectives })
    }

    load()
  }, [])

  const invalidateQueries = useInvalidateQueries()
  const dispatchWithInvalidate = useCallback(
    (...args) => {
      invalidateQueries(['session'])
      dispatch(...args)
    },
    [invalidateQueries, dispatch],
  )

  return (
    <ThemeProvider theme={theme}>
      <Helmet>
        <title>TI4 Companion</title>
        <meta
          content="Twilight Imperium Fourth Edition Companion App. Here you can manage your TI4 sessions and share them with your friends for a live game state view! If you want a quick reference of races present in the game, Public Objectives and current Victory Points - look no further."
          name="description"
        />
        <meta content="TI4 Companion" property="og:title" />
        <meta
          content="Twilight Imperium Fourth Edition Companion App. Here you can manage your TI4 sessions and share them with your friends for a live game state view! If you want a quick reference of races present in the game, Public Objectives and current Victory Points - look no further."
          property="og:description"
        />
      </Helmet>

      <Router>
        <CssBaseline />
        <AppBar>
          <Toolbar>
            <Link onClick={exitFullscreen} to="/">
              <IconButton>
                <img
                  alt={t('general.home')}
                  src={homeIcon}
                  style={{
                    height: '1.2em',
                    width: '1.2em',
                    borderRadius: '50%',
                  }}
                  title={t('general.home')}
                />
              </IconButton>
            </Link>
            <Typography className={classes.title} variant="h5">
              <Trans i18nKey="general.title" />
            </Typography>
            <LanguageSwitcher />
            <GitHubRibbon />
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Container className={clsx({ [classes.fullWidth]: fullscreen })}>
          <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatchWithInvalidate}>
              <KnowledgeBase />
              <Box m={2}>
                <Switch>
                  <Route path="/new">
                    <NewSession dispatch={dispatchWithInvalidate} />
                  </Route>
                  <Route path="/:sessionId/:secret?">
                    <SessionProvider
                      dispatch={dispatchWithInvalidate}
                      state={state}
                    >
                      {({
                        sessionService,
                        session,
                        loading,
                        editable,
                        shuffleFactions,
                        setFactions,
                        updateFactionPoints,
                      }) =>
                        loading || !session ? null : (
                          <SessionView
                            editable={editable && !session.locked}
                            session={session}
                            sessionService={sessionService}
                            setFactions={setFactions}
                            shuffleFactions={shuffleFactions}
                            updateFactionPoints={updateFactionPoints}
                          />
                        )
                      }
                    </SessionProvider>
                  </Route>
                  <Route path="/">
                    <SessionsList
                      loading={sessions.loading || !sessions.loaded}
                      sessions={sessions.data}
                    />
                  </Route>
                </Switch>
              </Box>
            </DispatchContext.Provider>
          </StateContext.Provider>
        </Container>
        <Footer />
      </Router>
    </ThemeProvider>
  )
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      notifyOnChangeProps: 'tracked',
      refetchOnWindowFocus: !config.isDevelopment,
    },
  },
})

function SignalRConnectedApp() {
  return (
    <SignalRConnectionProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        {config.isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </SignalRConnectionProvider>
  )
}

export default SignalRConnectedApp
