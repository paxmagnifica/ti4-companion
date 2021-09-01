import { useEffect, useReducer, useCallback } from 'react'
import { CircularProgress, Button, Box, Container, CssBaseline, AppBar, Toolbar, Typography } from '@material-ui/core'

import NewSession from './NewSession'
import SessionsList from './SessionsList'
import SessionView from './SessionView'
import { getAllSessions, saveSession } from './persistence'
import { VIEWS, reducer, init } from './state'

import './App.css'

const sessionFactory = {
  createSession: async factions => {
    const session = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      factions,
    }
    await saveSession(session)

    return session
  },
}

function App() {
  const [state, dispatch] = useReducer(reducer, null, init)
  const { view, sessions, sessionToView } = state;

  const goToNewGameSession = useCallback(() => dispatch({type: 'go', where: VIEWS.NEW_GAME }), [])
  const createGameSession = useCallback(factions => {
    const session = sessionFactory.createSession(factions)
    dispatch({type: 'createGameSession', session})
  }, [])

  const renderContent = useCallback(() => {
    switch (view) {
      case VIEWS.NEW_GAME:
        return <NewSession onSessionCreated={createGameSession} />
      case VIEWS.SESSION:
        return <SessionView
          session={sessions.data.find(s => s.id === sessionToView)}
        />
      default:
        return <>
          <Button onClick={goToNewGameSession}>New Game Session</Button>
          {
            sessions.loading || !sessions.loaded
              ? <CircularProgress />
              : <SessionsList sessions={sessions.data} dispatch={dispatch} />
          }
        </>
    }
  }, [view, sessions, goToNewGameSession, createGameSession, sessionToView])

  useEffect(() => {
    const load = async () => {
      const sessions = await getAllSessions()
      dispatch({ type: 'loadSessions', sessions })
    }

    load()
  }, [])

  return (
    <>
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <Typography variant="h5"><Button onClick={() => dispatch({ type: 'go', where: VIEWS.LIST })}>TI4 Companion</Button></Typography>
        </Toolbar>
      </AppBar>
      <Toolbar/>
      <Container>
        <Box m={2}>
          {renderContent()}
        </Box>
      </Container>
    </>
  );
}

export default App
