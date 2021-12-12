import { useState, useCallback } from 'react'
import { Button } from '@material-ui/core'
import shuffle from 'lodash.shuffle'

import { DraftPool } from './DraftPool'
import { useDraftQuery, useDraftMutation } from './queries'

const PHASE = {
  bans: 'bans',
  picks: 'picks',
  speaker: 'speaker',
}

function Speaker({ draft, session, sessionService }) {
  const speakerMutation = useCallback(async () => {
    const shuffled = shuffle([...Array(draft.players.length).keys()])

    const speakerIndex = shuffled[0]
    const speakerName = draft.players[speakerIndex]

    await sessionService.pushEvent(session.id, {
      type: 'SpeakerSelected',
      payload: {
        sessionId: session.id,
        speakerIndex,
        speakerName,
      },
    })
  }, [sessionService, session.id, draft])

  const { mutate: selectRandomSpeaker } = useDraftMutation({
    sessionId: session.id,
    mutation: speakerMutation,
  })

  const commitDraftMutation = useCallback(async () => {
    await sessionService.pushEvent(session.id, {
      type: 'CommitDraft',
    })
  }, [session.id, sessionService])

  const { mutate: commitDraft } = useDraftMutation({
    sessionId: session.id,
    mutation: commitDraftMutation,
  })

  return (
    <>
      <p>phase: {draft.phase}</p>
      <p>speaker: {draft.speaker || 'not selected'}</p>
      {!draft.speaker && (
        <Button onClick={selectRandomSpeaker} variant="contained">
          random speaker
        </Button>
      )}
      {draft.speaker && (
        <Button onClick={commitDraft} variant="contained">
          start
        </Button>
      )}
    </>
  )
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
    </>
  )
}

function Ban({ bans, clearSelection, draft, sessionService, session }) {
  const banMutation = useCallback(async () => {
    await sessionService.pushEvent(session.id, {
      type: 'Banned',
      payload: {
        sessionId: session.id,
        bans,
        playerIndex: draft.order[draft.activePlayerIndex],
        playerName: draft.players[draft.order[draft.activePlayerIndex]],
      },
    })
    clearSelection()
  }, [bans, sessionService, session.id, draft, clearSelection])

  const { mutate: ban } = useDraftMutation({
    sessionId: session.id,
    mutation: banMutation,
  })

  return (
    <>
      <p>
        who is banning: {draft.players[draft.order[draft.activePlayerIndex]]}
      </p>
      <Button
        disabled={bans.length < draft.bansPerRound}
        onClick={ban}
        variant="contained"
      >
        ban
      </Button>
    </>
  )
}

export function Drafting({ editable, session, sessionService }) {
  const [selected, setSelected] = useState([])
  const { draft } = useDraftQuery({
    sessionId: session.id,
    sessionService,
  })

  if (!draft) {
    return null
  }

  return (
    <>
      <p>phase: {draft.phase}</p>
      <p>order: {JSON.stringify(draft.order.map((o) => draft.players[o]))}</p>
      <p>
        active player: {draft.players[draft.order[draft.activePlayerIndex]]}
      </p>
      {draft.phase === PHASE.bans && (
        <Ban
          bans={selected}
          clearSelection={() => setSelected([])}
          draft={draft}
          session={session}
          sessionService={sessionService}
        />
      )}
      <DraftPool
        bans={draft.bans}
        initialPool={draft.initialPool}
        max={1}
        onSelected={setSelected}
        picks={draft.picks.filter(({ type }) => type === 'faction')}
        selected={selected}
      />
      <pre>{JSON.stringify({ session }, null, 2)}</pre>
    </>
  )
}
// {draft.phase === PHASE.picks && (
// <Pick draft={draft} session={session} sessionService={sessionService} />
// )}
// {draft.phase === PHASE.speaker && (
// <Speaker
// draft={draft}
// session={session}
// sessionService={sessionService}
// />
// )}
