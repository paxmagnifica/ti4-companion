import { useState } from 'react'
import { FactionImage } from '../../../../shared/FactionImage'
import { ActionOnFactionListButton } from '../components/ActionOnFactionListButton'
import { PlayerActionsStepper } from '../components/PlayerActionsStepper'
import { DraftPool } from '../DraftPool'

export function PickBan({ pickBans, initialPool }) {
  const steps = pickBans.map(({ choice, ...rest }) => ({
    choice: choice ? (
      <FactionImage
        factionKey={choice}
        style={{ width: 'auto', height: '100%' }}
      />
    ) : null,
    ...rest,
  }))

  const bans = pickBans
    .filter((pb) => pb.action === 'ban')
    .map((pb) => ({ ban: pb.choice, playerName: pb.player }))
  const picks = pickBans
    .filter((pb) => pb.action === 'pick')
    .map((pb) => ({ pick: pb.choice, playerName: pb.player }))

  const [selected, setSelected] = useState([])
  const FACTIONS_TO_SELECT = 1
  const { action } = pickBans.find(({ choice }) => choice === null)

  return (
    <>
      <PlayerActionsStepper steps={steps} />
      <ActionOnFactionListButton
        action={action}
        max={FACTIONS_TO_SELECT}
        selected={selected}
      />
      <DraftPool
        bans={bans}
        initialPool={initialPool || []}
        max={FACTIONS_TO_SELECT}
        onSelected={setSelected}
        picks={picks}
        selected={selected}
      />
    </>
  )
}
