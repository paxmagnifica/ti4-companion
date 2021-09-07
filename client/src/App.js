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
import { reducer, init } from './state'

function App() {
  useTheme()
  const [state, dispatch] = useReducer(reducer, null, init)
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

  // TODO refactor this shit xD
  useEffect(() => {
    setTimeout(() => saveAllSessions(sessions.data), 0)
  }, [sessions]);

  useEffect(() => {
    const load = async () => {
      const sessions = await getAllSessions()
      dispatch({ type: 'loadSessions', sessions })
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
              <Home />
            </IconButton>
          </Link>
          <Typography variant="h5">TI4 Companion</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar/>
      <Container>
        <Box m={2}>
          <Switch>
            <Route path="/new">
              <NewSession dispatch={dispatch} />
            </Route>
            <Route path="/:id">
              <SessionProvider state={state}>
                {(session, loading) => loading ? null : <SessionView
                  session={session}
                  shuffleFactions={shuffleFactions}
                  setFactions={setFactions}
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
      </Container>
    </Router>
  );
}

export default App
