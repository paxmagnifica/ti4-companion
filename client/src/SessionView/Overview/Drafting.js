import { useState, useCallback } from 'react'
import { Box, Button, Typography } from '@material-ui/core'
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
    window.location.reload()
  }, [session.id, sessionService])

  const { mutate: commitDraft } = useDraftMutation({
    sessionId: session.id,
    mutation: commitDraftMutation,
  })

  return (
    <>
      <p>speaker: {draft.speaker || 'not selected yet'}</p>
      <Button color="primary" onClick={selectRandomSpeaker} variant="contained">
        assign speaker at random
      </Button>
      <br />
      <br />
      {draft.speaker && (
        <Button color="secondary" onClick={commitDraft} variant="contained">
          commit draft & start session
        </Button>
      )}
    </>
  )
}

function Pick({ pick, clearSelection, draft, session, sessionService }) {
  const pickMutation = useCallback(async () => {
    await sessionService.pushEvent(session.id, {
      type: 'Picked',
      payload: {
        sessionId: session.id,
        pick,
        type: 'faction',
        playerIndex: draft.order[draft.activePlayerIndex],
        playerName: draft.players[draft.order[draft.activePlayerIndex]],
      },
    })
    clearSelection()
  }, [clearSelection, sessionService, pick, session.id, draft])

  const { mutate: pickFaction } = useDraftMutation({
    sessionId: session.id,
    mutation: pickMutation,
  })

  return (
    <>
      <Typography variant="h2">
        picking: {draft.players[draft.order[draft.activePlayerIndex]]}
      </Typography>
      <Button
        color="secondary"
        disabled={!pick}
        onClick={pickFaction}
        variant="contained"
      >
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
      <Typography variant="h3">
        banning: {draft.players[draft.order[draft.activePlayerIndex]]}
      </Typography>
      <Button
        color="secondary"
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

  const pickOrBan = [PHASE.picks, PHASE.bans].includes(draft.phase)

  return (
    <>
      <Box mb={2}>
        <Typography variant="h1">phase: {draft.phase}</Typography>
        {pickOrBan && (
          <Typography>
            order: {JSON.stringify(draft.order.map((o) => draft.players[o]))}
          </Typography>
        )}
        {draft.phase === PHASE.picks && (
          <Pick
            clearSelection={() => setSelected([])}
            draft={draft}
            pick={selected[0]}
            session={session}
            sessionService={sessionService}
          />
        )}
        {draft.phase === PHASE.bans && (
          <Ban
            bans={selected}
            clearSelection={() => setSelected([])}
            draft={draft}
            session={session}
            sessionService={sessionService}
          />
        )}
        {draft.phase === PHASE.speaker && (
          <Speaker
            draft={draft}
            session={session}
            sessionService={sessionService}
          />
        )}
      </Box>
      {draft.phase === PHASE.speaker && <Typography>picks:</Typography>}
      <DraftPool
        bans={draft.bans}
        initialPool={
          pickOrBan ? draft.initialPool : draft.picks.map(({ pick }) => pick)
        }
        max={1}
        onSelected={setSelected}
        picks={draft.picks}
        selected={selected}
      />
      {draft.phase === PHASE.speaker && (
        <>
          <Typography>bans:</Typography>
          <DraftPool
            bans={draft.bans}
            initialPool={draft.bans.map(({ ban }) => ban)}
            max={1}
            onSelected={setSelected}
            picks={draft.picks}
            selected={selected}
          />
        </>
      )}
    </>
  )
}
