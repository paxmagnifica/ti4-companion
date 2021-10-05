import debounce from 'lodash.debounce'

import CONFIG from '../config'

import { saveSession } from './persistence'

export const createSession = async factions => {
  const result = await fetch(`${CONFIG.apiUrl}/api/sessions`, { method: 'post', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(factions) })
  const session = await result.json()

  await saveSession(session)

  return session
}

export const get = async (id, secret) => {
  const result = await fetch(`${CONFIG.apiUrl}/api/sessions/${id}`, {
    headers: {
      'x-ti4companion-session-secret': secret,
    },
  })

  // TODO check status code

  return result.json()
}

export const pushEventImmediately = (sessionId, gameEvent) => fetch(`${CONFIG.apiUrl}/api/sessions/${sessionId}/events`, { method: 'post', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ eventType: gameEvent.type, serializedPayload: JSON.stringify(gameEvent.payload)}) })
export const pushEvent = debounce(pushEventImmediately, 400, { trailing: true, leading: true })
