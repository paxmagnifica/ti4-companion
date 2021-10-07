import {
  Chip,
  CircularProgress,
  Fab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Add, Done } from '@material-ui/icons'
import { Link, useHistory, generatePath } from 'react-router-dom'

import { SESSION_VIEW_ROUTES } from './shared/constants'
import * as factions from './gameInfo/factions'

const useStyles = makeStyles(theme => ({
  list: {
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '2%',
    '& .MuiListItem-root:hover': {
      backgroundColor: 'rgba(255,255,255,0.1)',
    },
    '& .MuiListSubheader-root': {
      background: 'none',
      color: 'white',
    },
    '& .MuiTypography-root': {
      color: 'white',
    },
  },
  fab: {
    position: 'sticky',
    float: 'right',
    right: 0,
    bottom: 10,
    marginTop: 10,
    zIndex: 1199,
  }
}))


function SessionsList({
  loading,
  sessions,
}) {
  const classes = useStyles()
  const history = useHistory()

  return loading
    ? <CircularProgress />
    : <>
      <List
        className={classes.list}
        subheader={
          <ListSubheader>
            Your remembered sessions
          </ListSubheader>
        }
      >
        {sessions.map(session => {
          const factionList = session.factions.map(factionKey => factions.getName(factionKey)).join(', ')

          return <ListItem
            button
            key={session.id}
            onClick={() => history.push(generatePath(SESSION_VIEW_ROUTES.main, { sessionId: session.id, secret: session.editable ? session.secret : undefined }))}
          >
            <ListItemText
              primary={session.displayName || factionList}
              secondary={`${session.start || ''}${session.displayName ? ` (factions: ${factionList})` : ''}`}
            />
            {session.editable && <ListItemIcon>
              <Chip color='secondary' label='Full Access' icon={<Done />} />
            </ListItemIcon>}
          </ListItem>
        })}
      </List>
      <Link to='/new'>
        <Fab
          color="primary"
          aria-label="add"
          className={classes.fab}
        >
          <Add />
        </Fab>
      </Link>
    </>
}

export default SessionsList
