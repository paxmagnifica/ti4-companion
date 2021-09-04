import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

export function SessionProvider({
  children,
  state,
}) {
  const { id } = useParams()

  const session = useMemo(() => state.sessions.data.find(s => s.id === id), [state, id])

  if (!id) {
    return null
  }

  return children(session)
}
