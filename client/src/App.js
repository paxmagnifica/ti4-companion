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
import { DispatchContext, StateContext, reducer, init } from './state'

function App() {
  useTheme()
  const [state, dispatch] = useReducer(reducer, null, init)
  const comboDispatch = useCallback(action => {
    console.log({ action })
    dispatch(action)
  }, [dispatch])
  const { sessions } = state

  const shuffleFactions = useCallback(sessionId => {
    // TODO remove logic duplication in reducer and stuff
    const session = sessions.data.find(s => s.id === sessionId)
    const shuffledFactions = shuffle(session.factions)
    sessionService.pushEvent(session.id, { type: 'factionsShuffled', payload: shuffledFactions })
    dispatch({ type: 'setFactions', sessionId, factions: shuffledFactions })
  }, [sessions.data])

  const setFactions = useCallback((sessionId, factions) => {
    // TODO remove logic duplication in reducer and stuff
    sessionService.pushEvent(sessionId, { type: 'factionsShuffled', payload: factions })
    dispatch({ type: 'setFactions', sessionId, factions })
  }, [])

  const updateFactionPoints = useCallback(({ sessionId, faction, points }) => {
    // TODO remove logic duplication in reducer and stuff
    const payload = { sessionId, faction, points }
    sessionService.pushEvent(sessionId, { type: 'victoryPointsUpdated', payload })
    dispatch({ type: 'updateVictoryPoints', payload })
  }, [])

  // TODO refactor this shit xD
  useEffect(() => {
    setTimeout(() => saveAllSessions(sessions.data.filter(session => !session.remote)), 0)
  }, [sessions]);

  useEffect(() => {
    const load = async () => {
      const sessionsPromise = getAllSessions()
      const objectivesPromise = objectivesService.getAll()

      const [sessions, objectives] = await Promise.allSettled([sessionsPromise, objectivesPromise])

      dispatch({ type: 'loadSessions', sessions: sessions.value })
      dispatch({ type: 'loadObjectives', objectives: objectives.value })
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
          <DispatchContext.Provider value={comboDispatch}>
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
        </StateContext.Provider>
      </Container>
    </Router>
  );
}

export default App
