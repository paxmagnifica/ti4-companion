import { useState, useCallback } from 'react'
import { Button } from '@material-ui/core'

import { factionsList } from '../../gameInfo/factions'
import { useComboDispatch } from '../../state'

import { FactionListGrid } from './FactionListGrid'

const PHASE = {
  ban: 'ban',
}

export function Drafting({ editable, session }) {
  const comboDispatch = useComboDispatch()
  const { draft } = {
    draft: {
      initialPool: factionsList,
      bans: ['The_Arborec', 'The_Barony_of_Letnev'],
      bansPerRound: 1,
      phase: 'ban',
      order: [2, 3, 1, 0, 0, 1, 3, 2],
      activePlayerIndex: [2],
      players: ['P1', 'P2', 'P3', 'P4'],
    },
  }

  const [selected, setSelected] = useState([])

  const ban = useCallback(() => {
    comboDispatch({
      type: 'Banned',
      payload: { sessionId: session.id, bans: selected },
    })
  }, [selected, comboDispatch, session.id])

  return (
    <>
      <p>phase: {draft.phase}</p>
      <p>already banned: {JSON.stringify(draft.bans)}</p>
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
      <pre>{JSON.stringify({ editable, session }, null, 2)}</pre>
    </>
  )
}
