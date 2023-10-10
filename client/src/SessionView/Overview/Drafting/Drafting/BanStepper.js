import { FactionImage } from '../../../../shared/FactionImage'
import { PlayerActionsStepper } from '../components/PlayerActionsStepper'

export function BanStepper({ draft, setup }) {
  const { playerCount, bansPerRound, banRounds } = setup.options

  const steps = new Array(playerCount * banRounds)
    .fill(0)
    .map((_p, playerIndex) => {
      const player = draft.players[playerIndex]
      const bans = new Array(bansPerRound)
        .fill(0)
        .map((_b, banIndex) => {
          const ban = draft.bans[playerIndex * bansPerRound + banIndex]

          return ban?.ban || null
        })
        .filter(Boolean)

      return {
        player,
        choice:
          bans.length === 0 ? null : (
            <>
              {bans.map((ban) => (
                <FactionImage
                  factionKey={ban}
                  style={{ width: 'auto', height: '100%' }}
                />
              ))}
            </>
          ),
      }
    })

  return <PlayerActionsStepper steps={steps} />
}
