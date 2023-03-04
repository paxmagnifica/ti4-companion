import { useCallback, useMemo } from 'react'
import { Dialog } from '@material-ui/core'

import { getMapPositionName, getMapPositionColor } from '../../shared'
import { DraftSummaryTable } from '../components'
import { useSessionContext } from '../useSessionContext'

export function DraftSummaryDialog({ open, set }) {
  const { session } = useSessionContext()

  const closeDialog = useCallback(() => set(false), [set])

  const picks = useMemo(
    () =>
      session.players.map((player) => ({
        ...player,
        tablePosition: {
          name: getMapPositionName({
            mapPositions: session.mapPositions,
            position: player.atTable,
          }),
          color: getMapPositionColor({
            mapPositions: session.mapPositions,
            position: player.atTable,
          }),
        },
      })),
    [session.players, session.mapPositions],
  )

  return (
    <Dialog onClose={closeDialog} open={open}>
      <DraftSummaryTable
        map={session.map}
        mapLink={session.mapLink}
        picks={picks}
        speaker={session.draft.speaker}
        withTablePositions={Boolean(session.setup?.options?.tablePick)}
      />
    </Dialog>
  )
}
