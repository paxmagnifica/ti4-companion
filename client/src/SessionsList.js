import { List, ListItem, ListItemText } from '@material-ui/core'

import * as factions from './gameInfo/factions'
import { VIEWS } from './state'

function SessionsList({
  sessions,
  dispatch,
}) {
  return <List component="nav">
    {sessions.map(session =>
      <ListItem
        button
        key={session.id}
        onClick={() => dispatch({ type: 'go', where: VIEWS.SESSION, payload: {sessionToView: session.id} })}
      >
        <ListItemText
          primary={session.factions.map(factionKey => factions.getName(factionKey)).join(', ')}
          secondary={`${new Date(session.createdAt).toLocaleDateString()} ${new Date(session.createdAt).toLocaleTimeString()}`}
        />
      </ListItem>
    )}
  </List>
}

export default SessionsList
