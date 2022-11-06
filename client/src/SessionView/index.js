import { useHistory } from 'react-router-dom'

import { SessionContainer } from './SessionContainer'
import { useSessionContext } from './useSessionContext'
import { SessionView } from './SessionView'

function Thing({ setChatVisibility }) {
  const history = useHistory()
  const { setSecret, sessionService, editable, session, updateFactionPoints } =
    useSessionContext()

  if (!session) {
    return null
  }

  const { state, pathname } = history.location
  if (state?.secret) {
    setSecret(state.secret)
    history.replace(pathname, null)
  }

  if (session.error) {
    return <p>{session.error}</p>
  }

  return (
    <SessionView
      editable={editable}
      session={session}
      sessionService={sessionService}
      setChatVisibility={setChatVisibility}
      updateFactionPoints={updateFactionPoints}
    />
  )
}

export default (props) => (
  <SessionContainer>
    <Thing {...props} />
  </SessionContainer>
)
