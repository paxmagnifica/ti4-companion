const KEY = 'ti4companion-sessions'

export const saveAllSessions = newSessions => {
  localStorage.setItem(KEY, JSON.stringify(newSessions))
}

export const getAllSessions = () => {
  const storedSessionString = localStorage.getItem(KEY)
  if (storedSessionString) {
    return JSON.parse(storedSessionString)
  }

  return []
}

export const saveSession = session => {
  const sessions = getAllSessions();

  const newSessions = sessions.filter(s => s.id !== session.id)
  newSessions.push(session)
  newSessions.sort((a, b) => a.createdAt - b.createdAt)

  saveAllSessions(newSessions)
}

