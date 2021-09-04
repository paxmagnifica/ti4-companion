import debounce from 'lodash.debounce'

import { saveSession } from './persistence'

export const createSession = async factions => {
  const result = await fetch('/api/sessions', { method: 'post', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(factions) })
  const session = await result.json()

  await saveSession(session)

  return session
}

const rawUpdate = session => fetch(`/api/sessions/${session.id}`, { method: 'put', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(session) })
export const update = debounce(rawUpdate, 400, { trailing: true })
