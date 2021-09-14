import { useEffect, useReducer, useCallback } from 'react'
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
} from "react-router-dom";
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { Home } from '@material-ui/icons'
import { useTheme } from '@material-ui/core/styles'
import shuffle from 'lodash.shuffle'

import NewSession from './NewSession'
import SessionsList from './SessionsList'
import SessionView, { SessionProvider } from './SessionView'
import { getAllSessions, saveAllSessions } from './persistence'
import * as sessionService from './sessionService'
import * as objectivesService from './objectivesService'
import { ComboDispatchContext, DispatchContext, StateContext, reducer, init } from './state'
import { SignalRConnectionProvider } from './signalR'

function App() {
  useTheme()

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

  // TODO refactor this shit xD
  useEffect(() => {
    setTimeout(() => saveAllSessions(sessions.data.filter(session => !session.remote)), 0)
  }, [sessions]);

  useEffect(() => {
    const load = async () => {
      const sessionsPromise = getAllSessions()
      const objectivesPromise = objectivesService.getAll()

      const [sessions, objectives] = await Promise.allSettled([sessionsPromise, objectivesPromise])

      dispatch({ type: 'LoadSessions', sessions: sessions.value })
      dispatch({ type: 'LoadObjectives', objectives: objectives.value })
    }

    load()
  }, [])

  return (
    <Router>
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <Link to='/'>
            <IconButton >
              <Home style={{ color: 'white' }} />
            </IconButton>
          </Link>
          <Typography variant="h5">TI4 Companion</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar/>
      <Container>
        <StateContext.Provider value={state}>
        <ComboDispatchContext.Provider value={comboDispatch}>
        <DispatchContext.Provider value={dispatch}>
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
  );
}

function SignalRConnectedApp() {
  return <SignalRConnectionProvider>
    <App/>
  </SignalRConnectionProvider>
}

export default SignalRConnectedApp
