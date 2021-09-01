import { useEffect, useReducer, useCallback } from 'react'
import {
  AppBar,
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  Fab,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { Home, Add } from '@material-ui/icons'
import { makeStyles, useTheme } from '@material-ui/core/styles';

import NewSession from './NewSession'
import SessionsList from './SessionsList'
import SessionView from './SessionView'
import { getAllSessions, saveSession } from './persistence'
import { VIEWS, reducer, init } from './state'

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

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'sticky',
    float: 'right',
    right: 0,
    bottom: 0,
    zIndex: 9001,
  }
}))

function App() {
  useTheme()
  const classes = useStyles()
  const [state, dispatch] = useReducer(reducer, null, init)
  const { view, sessions, sessionToView } = state;

  const goToNewGameSession = useCallback(() => dispatch({type: 'go', where: VIEWS.NEW_GAME }), [])
  const createGameSession = useCallback(async factions => {
    const session = await sessionFactory.createSession(factions)
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
          {
            sessions.loading || !sessions.loaded
              ? <CircularProgress />
              : <SessionsList sessions={sessions.data} dispatch={dispatch} />
          }
          <Fab
            onClick={goToNewGameSession}
            color="primary"
            aria-label="add"
            className={classes.fab}
          >
            <Add />
          </Fab>
        </>
    }
  }, [view, classes.fab, sessions, goToNewGameSession, createGameSession, sessionToView])

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
          <IconButton
            onClick={() => dispatch({ type: 'go', where: VIEWS.LIST })}
          >
            <Home />
          </IconButton>
          <Typography variant="h5">TI4 Companion</Typography>
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
