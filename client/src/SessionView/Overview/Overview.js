import { Session } from './Session'
import { Drafting } from './Drafting'

// TODO catch error, clear from local storage and ask for refresh
export function Overview({ editable, session, updateFactionPoints }) {
  return session.sessionState.isDraft ? (
    <Drafting editable={editable} sesssion={session} />
  ) : (
    <Session
      editable={editable}
      session={session}
      updateFactionPoints={updateFactionPoints}
    />
  )
}
