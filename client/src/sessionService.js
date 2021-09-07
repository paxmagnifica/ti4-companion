import debounce from 'lodash.debounce'

import { saveSession } from './persistence'
import CONFIG from './config'

export const createSession = async factions => {
  const result = await fetch(`${CONFIG.apiUrl}/api/sessions`, { method: 'post', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(factions) })
  const session = await result.json()

  await saveSession(session)

  return session
}

const rawUpdate = session => fetch(`${CONFIG.apiUrl}/api/sessions/${session.id}`, { method: 'put', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(session) })
export const update = debounce(rawUpdate, 400, { trailing: true })

export const get = async id => {
  const result = await fetch(`${CONFIG.apiUrl}/api/sessions/${id}`)

  // TODO check status code

  return result.json()
}
