import { useCallback, useState } from 'react'
import { useDomainErrors } from '../../../../shared/errorHandling'
import { useDraftMutation } from '../queries'
import { BanStepper } from './BanStepper'
import { ActionOnFactionListButton } from '../components/ActionOnFactionListButton'
import { DraftPool } from '../DraftPool'

export function Ban({ disabled, draft, sessionService, session }) {
  const [bans, setBans] = useState([])

  const { setError } = useDomainErrors()
  const banMutation = useCallback(async () => {
    try {
      await sessionService.pushEvent(session.id, {
        type: 'Banned',
        payload: {
          sessionId: session.id,
          bans,
          playerIndex: draft.order[draft.activePlayerIndex],
          playerName: draft.players[draft.order[draft.activePlayerIndex]],
        },
      })
      setBans([])
    } catch (e) {
      setError(e)
    }
  }, [bans, setError, sessionService, session.id, draft])

  const { mutate: ban } = useDraftMutation({
    sessionId: session.id,
    mutation: banMutation,
  })

  return (
    <>
      <BanStepper draft={draft} setup={session.setup} />
      <ActionOnFactionListButton
        action="ban"
        disabled={disabled}
        max={draft.bansPerRound}
        onClick={ban}
        selected={bans}
      />
      <DraftPool
        bans={draft.bans}
        disabled={
          disabled ||
          draft.picks.some(
            ({ type, playerIndex }) =>
              type === 'faction' &&
              Number(draft.order[draft.activePlayerIndex]) ===
                Number(playerIndex),
          )
        }
        initialPool={draft.initialPool}
        max={draft.bansPerRound || 1}
        onSelected={setBans}
        picks={[]}
        selected={bans}
      />
    </>
  )
}
