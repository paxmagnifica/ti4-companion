import { saveSession } from './persistence'

export const createSession = async factions => {
  const result = await fetch('/api/sessions', { method: 'post', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(factions) })
  const session = await result.json()

  await saveSession(session)

  return session
}
