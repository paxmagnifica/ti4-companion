import { Session } from './Session'
import { Drafting } from './Drafting'

// TODO catch error, clear from local storage and ask for refresh
export function Overview({
  editable,
  session,
  updateFactionPoints,
  sessionService,
}) {
  return session.isDraft ? (
    <Drafting
      editable={editable}
      session={session}
      sessionService={sessionService}
    />
  ) : (
    <Session
      editable={editable}
      session={session}
      updateFactionPoints={updateFactionPoints}
    />
  )
}
