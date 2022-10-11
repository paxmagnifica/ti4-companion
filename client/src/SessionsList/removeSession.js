import CONFIG from '../config'
import { handleErrors } from '../shared/errorHandling'

export async function deleteSession(sessionId, password) {
  await fetch(`${CONFIG.apiUrl}/api/sessions/${sessionId}`, {
    method: 'delete',
  }).then(handleErrors)
}
