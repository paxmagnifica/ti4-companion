import { useEffect, useMemo, useReducer } from 'react'
import clsx from 'clsx'
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
} from 'react-router-dom'
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
import { makeStyles, createTheme, ThemeProvider } from '@material-ui/core/styles'

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
import './i18n'

const useStyles = makeStyles({
  fullWidth: {
    width: '100%',
    maxWidth: '100%',
  }
})

function App() {
  const classes = useStyles()
  const [state, dispatch] = useReducer(reducer, null, init)
  const { sessions } = state

  const theme = useMemo(() => createTheme({
    palette: {
      type: 'dark',
    },
  }), [])

  const { fullscreen, exitFullscreen } = useFullscreen()

  useEffect(() => {
    const sessions = getAllSessions()
    dispatch({ type: 'LoadSessions', sessions })

    const load = async () => {
      const objectives = await objectivesService.getAll()

      dispatch({ type: 'LoadObjectives', objectives })
    }

    load()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Helmet>
        <title>TI4 Companion</title>
        <meta name="description" content="Twilight Imperium Fourth Edition Companion App. Here you can manage your TI4 sessions and share them with your friends for a live game state view! If you want a quick reference of races present in the game, Public Objectives and current Victory Points - look no further." />
        <meta property="og:title" content="TI4 Companion" />
        <meta property="og:description" content="Twilight Imperium Fourth Edition Companion App. Here you can manage your TI4 sessions and share them with your friends for a live game state view! If you want a quick reference of races present in the game, Public Objectives and current Victory Points - look no further." />
      </Helmet>

      <Router>
        <CssBaseline />
        <AppBar>
          <Toolbar>
            <Link to='/' onClick={exitFullscreen}>
              <IconButton >
                <img
                  src={homeIcon}
                  style={{ height: '1.2em', width: '1.2em', borderRadius: '50%' }}
                  title="Home"
                  alt="Home icon"
                />
              </IconButton>
            </Link>
            <Typography variant="h5">TI4 Companion</Typography>
          </Toolbar>
        </AppBar>
        <Toolbar/>
        <Container className={clsx({ [classes.fullWidth]: fullscreen })}>
          <StateContext.Provider value={state}>
          <DispatchContext.Provider value={dispatch}>
            <KnowledgeBase />
            <Box m={2}>
              <Switch>
                <Route path="/new">
                  <NewSession dispatch={dispatch} />
                </Route>
                <Route path="/:sessionId/:secret?">
                  <SessionProvider state={state} dispatch={dispatch}>
                    {({
                      session,
                      loading,
                      editable,
                      shuffleFactions,
                      setFactions,
                      updateFactionPoints,
                    }) => (loading || !session) ? null : <SessionView
                      session={session}
                      editable={editable}
                      shuffleFactions={shuffleFactions}
                      setFactions={setFactions}
                      updateFactionPoints={updateFactionPoints}
                    />}
                  </SessionProvider>
                </Route>
                <Route path="/">
                  <SessionsList
                    sessions={sessions.data}
                    loading={sessions.loading || !sessions.loaded}
                  />
                </Route>
              </Switch>
            </Box>
          </DispatchContext.Provider>
          </StateContext.Provider>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

function SignalRConnectedApp() {
  return <SignalRConnectionProvider>
    <App/>
  </SignalRConnectionProvider>
}

export default SignalRConnectedApp
