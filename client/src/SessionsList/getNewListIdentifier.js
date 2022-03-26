import CONFIG from '../config'
import { handleErrors } from '../shared/errorHandling'

const DEPRECATED_LOCAL_STORAGE_KEY = 'ti4companion-sessions'
export const getAllSessionsFromDeprecatedLocalStorage = () => {
  const storedSessionString = localStorage.getItem(DEPRECATED_LOCAL_STORAGE_KEY)
  if (storedSessionString) {
    return JSON.parse(storedSessionString)
  }

  return []
}

export async function getNewListIdentifier() {
  const allSessions = await getAllSessionsFromDeprecatedLocalStorage()

  const response = await fetch(`${CONFIG.apiUrl}/api/sessionList`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      allSessions.map((session) => session.id).filter(Boolean),
    ),
  }).then(handleErrors)

  const { sessionId } = await response.json()

  localStorage.removeItem(DEPRECATED_LOCAL_STORAGE_KEY)

  return sessionId
}
