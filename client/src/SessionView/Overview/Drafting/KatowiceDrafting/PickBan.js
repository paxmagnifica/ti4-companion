import { useCallback, useState } from 'react'
import { useDomainErrors } from '../../../../shared/errorHandling'
import { FactionImage } from '../../../../shared/FactionImage'
import { ActionOnFactionListButton } from '../components/ActionOnFactionListButton'
import { PlayerActionsStepper } from '../components/PlayerActionsStepper'
import { DraftPool } from '../DraftPool'
import { useDraftMutation } from '../queries'

export function PickBan({ pickBans, initialPool, sessionService, sessionId }) {
  const steps = pickBans.map(({ choice, ...rest }) => ({
    ...rest,
    choice: choice ? (
      <FactionImage
        factionKey={choice}
        style={{ width: 'auto', height: '100%' }}
      />
    ) : null,
  }))

  const bans = pickBans
    .filter((pb) => pb.action === 'ban')
    .map((pb) => ({ ban: pb.choice, playerName: pb.player }))
  const picks = pickBans
    .filter((pb) => pb.action === 'pick')
    .map((pb) => ({ pick: pb.choice, playerName: pb.player }))

  const [selected, setSelected] = useState([])
  const FACTIONS_TO_SELECT = 1
  const { action, playerIndex } = pickBans.find(({ choice }) => choice === null)

  const { setError } = useDomainErrors()
  const pickBanMutation = useCallback(async () => {
    try {
      const [selectedFaction] = selected
      await sessionService.pushEvent(sessionId, {
        type: 'PickBan',
        payload: {
          action,
          faction: selectedFaction,
          playerIndex,
        },
      })
    } catch (e) {
      setError(e)
    }
  }, [sessionId, setError, sessionService, selected, action, playerIndex])

  const { mutate: pickBan, isLoading } = useDraftMutation({
    sessionId,
    mutation: pickBanMutation,
  })

  return (
    <>
      <PlayerActionsStepper steps={steps} />
      <ActionOnFactionListButton
        action={action}
        loading={isLoading}
        max={FACTIONS_TO_SELECT}
        onClick={pickBan}
        selected={selected}
      />
      <DraftPool
        bans={bans}
        initialPool={initialPool || []}
        max={FACTIONS_TO_SELECT}
        onSelected={setSelected}
        picks={picks}
        selected={selected}
        disabled={isLoading}
      />
    </>
  )
}
