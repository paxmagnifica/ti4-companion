import CONFIG from '../config'
import { getAllSessions } from '../shared/persistence'
import { handleErrors } from '../shared/errorHandling'

export async function getNewListIdentifier() {
  const allSessions = await getAllSessions()

  const response = await fetch(`${CONFIG.apiUrl}/api/sessionList`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      allSessions.map((session) => session.id).filter(Boolean),
    ),
  }).then(handleErrors)

  const { sessionId } = await response.json()

  return sessionId
}
