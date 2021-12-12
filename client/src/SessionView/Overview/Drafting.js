import { useState, useCallback } from 'react'
import { Button } from '@material-ui/core'

import { FactionListGrid } from './FactionListGrid'
import { useDraftQuery, useDraftMutation } from './queries'

const PHASE = {
  bans: 'bans',
}

function Pick({ draft, session, sessionService }) {
  const [selected, setSelected] = useState([])
  const pickMutation = useCallback(async () => {
    await sessionService.pushEvent(session.id, {
      type: 'Picked',
      payload: {
        sessionId: session.id,
        pick: selected[0],
        type: 'faction',
        playerIndex: draft.order[draft.activePlayerIndex],
        playerName: draft.players[draft.order[draft.activePlayerIndex]],
      },
    })
    setSelected([])
  }, [selected, sessionService, session.id, draft])

  const { mutate: pickFaction } = useDraftMutation({
    sessionId: session.id,
    mutation: pickMutation,
  })

  return (
    <>
      <p>phase: {draft.phase}</p>
      <p>order: {JSON.stringify(draft.order.map((o) => draft.players[o]))}</p>
      <p>picks: {JSON.stringify(draft.picks)}</p>
      <p>
        who is picking: {draft.players[draft.order[draft.activePlayerIndex]]}
      </p>
      <p>selected: {JSON.stringify(selected)}</p>
      <Button onClick={pickFaction} variant="contained">
        pick
      </Button>
      <FactionListGrid
        factions={draft.initialPool}
        inactive={[
          ...draft.bans,
          ...draft.picks
            .filter(({ type }) => type === 'faction')
            .map(({ pick }) => pick),
        ]}
        max={1}
        onSelected={setSelected}
        selected={selected}
      />
    </>
  )
}

function Ban({ draft, sessionService, session }) {
  const [selected, setSelected] = useState([])
  const banMutation = useCallback(async () => {
    await sessionService.pushEvent(session.id, {
      type: 'Banned',
      payload: {
        sessionId: session.id,
        bans: selected,
        playerIndex: draft.order[draft.activePlayerIndex],
        playerName: draft.players[draft.order[draft.activePlayerIndex]],
      },
    })
    setSelected([])
  }, [selected, sessionService, session.id, draft])

  const { mutate: ban } = useDraftMutation({
    sessionId: session.id,
    mutation: banMutation,
  })

  return (
    <>
      <p>phase: {draft.phase}</p>
      <p>already banned: {JSON.stringify(draft.bans)}</p>
      <p>order: {JSON.stringify(draft.order.map((o) => draft.players[o]))}</p>
      <p>
        who is banning: {draft.players[draft.order[draft.activePlayerIndex]]}
      </p>
      <p>selected: {JSON.stringify(selected)}</p>
      <Button onClick={ban} variant="contained">
        ban
      </Button>
      <FactionListGrid
        factions={draft.initialPool}
        inactive={draft.bans}
        max={draft.bansPerRound}
        onSelected={setSelected}
        selected={selected}
      />
    </>
  )
}

export function Drafting({ editable, session, sessionService }) {
  const { draft } = useDraftQuery({
    sessionId: session.id,
    sessionService,
  })

  if (!draft) {
    return null
  }

  return (
    <>
      {draft.phase === PHASE.bans ? (
        <Ban draft={draft} session={session} sessionService={sessionService} />
      ) : (
        <Pick draft={draft} session={session} sessionService={sessionService} />
      )}
      <pre>{JSON.stringify({ session }, null, 2)}</pre>
    </>
  )
}
