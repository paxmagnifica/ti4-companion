import { useEffect, useCallback, useMemo, useReducer, useState } from 'react'
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

import { SupportTheCreator } from './Support'
import { getAllSessions } from './shared/persistence'
import { DomainErrorProvider } from './shared/errorHandling'
import homeIcon from './assets/icon.jpg'
import { SessionSetup } from './SessionSetup'
import { SessionsListContainer } from './SessionsList'
import { CallsToAction } from './CallsToAction'
import SessionView from './SessionView'
import { SessionProvider } from './SessionView/SessionProvider'
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
import { useChat } from './Chat'
import { FetchProvider } from './useFetch'

i18nFactory()

const useStyles = makeStyles((theme) => ({
  main: {
    paddingBottom: theme.spacing(3),
  },
  fullWidth: {
    width: '100%',
    maxWidth: '100%',
  },
  title: {
    flexGrow: 1,
  },
}))

const LIST_IDENTIFIER_KEY = 'paxmagnifica-ti4companion-list-identifier'
function App() {
  const { t } = useTranslation()
  const classes = useStyles()
  const [state, dispatch] = useReducer(reducer, null, init)
  const { setChatVisible } = useChat()
  const [domainError, setDomainError] = useState(null)
  const [listIdentifier, setListIdentifier] = useState(
    localStorage.getItem(LIST_IDENTIFIER_KEY),
  )
  const setAndPersistListIdentifier = useCallback(
    (newIdentifier) => {
      localStorage.setItem(LIST_IDENTIFIER_KEY, newIdentifier)
      setListIdentifier(newIdentifier)
    },
    [setListIdentifier],
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          type: 'dark',
        },
      }),
    [],
  )

  const { fullscreen, exitFullscreen } = useFullscreen({
    onFullscreenChange: (x) => setChatVisible(!x),
  })

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
      <DomainErrorProvider error={domainError} setError={setDomainError}>
        <FetchProvider sessionListIdentifier={listIdentifier}>
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
                <SupportTheCreator />
                <LanguageSwitcher />
                <GitHubRibbon />
              </Toolbar>
            </AppBar>
            <Toolbar />
            <Container
              className={clsx(classes.main, {
                [classes.fullWidth]: fullscreen,
              })}
            >
              <StateContext.Provider value={state}>
                <DispatchContext.Provider value={dispatchWithInvalidate}>
                  <KnowledgeBase />
                  <Box m={2}>
                    <Switch>
                      <Route path="/new">
                        <SessionSetup />
                      </Route>
                      <Route path="/:sessionId/:secret?">
                        <SessionProvider
                          dispatch={dispatchWithInvalidate}
                          state={state}
                        >
                          <SessionView />
                        </SessionProvider>
                      </Route>
                      <Route path="/">
                        <CallsToAction />
                        <SessionsListContainer
                          listIdentifier={listIdentifier}
                          setListIdentifier={setAndPersistListIdentifier}
                        />
                      </Route>
                    </Switch>
                  </Box>
                </DispatchContext.Provider>
              </StateContext.Provider>
            </Container>
            {!fullscreen && <Footer />}
          </Router>
        </FetchProvider>
        >
      </DomainErrorProvider>
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
