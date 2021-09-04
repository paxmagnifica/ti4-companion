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
  fab: {
    position: 'sticky',
    float: 'right',
    right: 0,
    bottom: 0,
    zIndex: 9001,
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
        subheader={
          <ListSubheader>
            Your remembered sessions
          </ListSubheader>
        }
      >
        {sessions.map(session =>
          <ListItem
            button
            key={session.id}
            onClick={() => history.push(`/${session.id}`)}
          >
            <ListItemText
              primary={session.factions.map(factionKey => factions.getName(factionKey)).join(', ')}
              secondary={`${new Date(session.createdAt).toLocaleDateString()} ${new Date(session.createdAt).toLocaleTimeString()}`}
            />
          </ListItem>
        )}
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
