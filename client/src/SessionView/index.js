import { useHistory } from 'react-router-dom'

import { useSessionContext } from './SessionProvider'
import { SessionView } from './SessionView'

function Thing({ children }) {
  const history = useHistory()
  const { setSecret, sessionService, editable, session, updateFactionPoints } =
    useSessionContext()

  if (!session) {
    return null
  }

  const { state } = history.location
  if (state?.secret) {
    setSecret(session.id, state.secret)
  }

  return (
    <SessionView
      editable={editable}
      session={session}
      sessionService={sessionService}
      updateFactionPoints={updateFactionPoints}
    >
      {children}
    </SessionView>
  )
}

export default Thing
