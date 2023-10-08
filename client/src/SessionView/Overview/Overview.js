import { Session } from './Session'
import { Drafting } from './Drafting'
import { PointsSourceHelper } from './PointsSourceHelper'

// TODO catch error, clear from local storage and ask for refresh
export function Overview({
  editable,
  session,
  updateFactionPoints,
  sessionService,
  setChatVisibility,
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
    >
      {!session.locked && (
        <PointsSourceHelper
          editable={editable}
          sessionService={sessionService}
          sessionId={session.id}
          factions={session.factions}
          setChatVisibility={setChatVisibility}
        />
      )}
    </Session>
  )
}
