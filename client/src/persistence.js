const KEY = 'ti4companion-sessions'

export const getAllSessions = () => {
  const storedSessionString = localStorage.getItem(KEY)
  if (storedSessionString) {
    return JSON.parse(storedSessionString)
  }

  return []
}

export const saveSession = async session => {
  const sessions = await getAllSessions();

  const newSessions = sessions.filter(s => s.id !== session.id)
  newSessions.push(session)
  newSessions.sort((a, b) => a.createdAt - b.createdAt)

  localStorage.setItem(KEY, JSON.stringify(newSessions))
}
