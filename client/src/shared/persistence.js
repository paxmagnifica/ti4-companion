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

  let newSession = session
  const sessionWithTheSameIdIndex = sessions.findIndex(s => s.id === session.id)
  if (sessionWithTheSameIdIndex >= 0) {
    newSession = {
      ...session,
      editable: sessions[sessionWithTheSameIdIndex].editable || session.editable,
      secret: session.editable
        ? session.secret
        : sessions[sessionWithTheSameIdIndex].secret,
    }
  }

  const newSessions = sessions.filter(s => s.id !== session.id)
  newSessions.push(newSession)
  newSessions.sort((a, b) => a.createdAt - b.createdAt)

  saveAllSessions(newSessions)
}

