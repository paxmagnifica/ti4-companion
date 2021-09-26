import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  CircularProgress,
  Fab,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Add } from '@material-ui/icons'
import { Link, useHistory } from 'react-router-dom'

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
            onClick={() => history.push(`/${session.id}`)}
          >
            <ListItemText
              primary={session.displayName || factionList}
              secondary={`${session.start || ''}${session.displayName ? ` (factions: ${factionList})` : ''}`}
            />
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
