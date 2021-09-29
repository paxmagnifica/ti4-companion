import { useMemo, useEffect, useReducer, useCallback } from 'react'
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
import shuffle from 'lodash.shuffle'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'

import homeIcon from './assets/icon.jpg'
import { getAllSessions } from './shared/persistence'
import * as sessionService from './shared/sessionService'
import NewSession from './NewSession'
import SessionsList from './SessionsList'
import SessionView, { SessionProvider } from './SessionView'
import * as objectivesService from './objectivesService'
import { ComboDispatchContext, DispatchContext, StateContext, reducer, init } from './state'
import { SignalRConnectionProvider } from './signalR'
import KnowledgeBase from './KnowledgeBase'
import { useFullscreen } from './Fullscreen'

function App() {
  const [state, dispatch] = useReducer(reducer, null, init)
  const comboDispatch = useCallback(action => {
    const { payload } = action
    sessionService.pushEvent(payload.sessionId, { type: action.type, payload })
    dispatch(action)
  }, [dispatch])
  const { sessions } = state

  const shuffleFactions = useCallback(sessionId => {
    const session = sessions.data.find(s => s.id === sessionId)
    const shuffledFactions = shuffle(session.factions)
    const payload = { factions: shuffledFactions, sessionId }
    comboDispatch({ type: 'FactionsShuffled', payload })
  }, [sessions.data, comboDispatch])

  const setFactions = useCallback((sessionId, factions) => {
    const payload = { factions, sessionId }
    comboDispatch({ type: 'FactionsShuffled', payload })
  }, [comboDispatch])

  const updateFactionPoints = useCallback(({ sessionId, faction, points }) => {
    const payload = { sessionId, faction, points }
    comboDispatch({ type: 'VictoryPointsUpdated', payload })
  }, [comboDispatch])

  useEffect(() => {
    const sessions = getAllSessions()
    dispatch({ type: 'LoadSessions', sessions })

    const load = async () => {
      const objectives = await objectivesService.getAll()

      dispatch({ type: 'LoadObjectives', objectives })
    }

    load()
  }, [])

  const theme = useMemo(() => createTheme({
    palette: {
      type: 'dark',
    },
  }), [])

  const { fullscreen, exitFullscreen } = useFullscreen()

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
        <Container maxWidth={fullscreen ? 'xl' : 'lg'}>
          <StateContext.Provider value={state}>
          <ComboDispatchContext.Provider value={comboDispatch}>
          <DispatchContext.Provider value={dispatch}>
            <KnowledgeBase />
            <Box m={2}>
              <Switch>
                <Route path="/new">
                  <NewSession dispatch={dispatch} />
                </Route>
                <Route path="/:id">
                  <SessionProvider state={state} dispatch={dispatch}>
                    {(session, loading) => (loading || !session) ? null : <SessionView
                      session={session}
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
          </ComboDispatchContext.Provider>
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
