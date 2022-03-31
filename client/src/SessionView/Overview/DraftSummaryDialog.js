import { useCallback, useMemo } from 'react'
import { Dialog } from '@material-ui/core'

import { DraftSummaryTable } from '../components'
import { useSessionContext } from '../useSessionContext'

export function DraftSummaryDialog({ open, set }) {
  const { session } = useSessionContext()

  const closeDialog = useCallback(() => set(false), [set])

  const picks = useMemo(
    () =>
      session.players.map((player) => ({
        ...player,
        tablePosition: player.atTable,
      })),
    [session.players],
  )

  return (
    <Dialog onClose={closeDialog} open={open}>
      <DraftSummaryTable
        map={session.map}
        picks={picks}
        speaker={session.draft.speaker}
        withTablePositions={Boolean(session.setup?.options?.tablePick)}
      />
    </Dialog>
  )
}
