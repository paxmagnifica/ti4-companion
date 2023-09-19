import { Typography } from '@material-ui/core'
import { useState } from 'react'
import { PlayerActionsStepper } from '../components/PlayerActionsStepper'
import { DraftPool } from '../DraftPool'
import { TablePositionSelection } from './components/TablePositionSelection'
import { InitiativeSelection } from './components/InitiativeSelection'
import { Choice } from './components/Choice'

export function Draft({ pickBans, nominations, draft, mapPositions }) {
  const steps = draft.map(({ choice, action, ...rest }) => ({
    ...rest,
    action,
    choice: !choice ? null : <Choice action={action} choice={choice} mapPositions={mapPositions} />,
  }))
  const currentPlayer = draft.find(({ choice }) => choice === null)

  const [selection, setSelection] = useState(null)

  const draftPool = [
    ...pickBans.filter((pb) => pb.action === 'pick').map((pb) => pb.choice),
    ...nominations
      .filter((nom) => nom.action === 'confirm')
      .map((nom) => nom.choice),
  ]

  return (
    <>
      <PlayerActionsStepper steps={steps} />
      <InitiativeSelection
        currentPlayer={currentPlayer}
        draft={draft}
        onSelected={setSelection}
        selection={selection}
      />
      <TablePositionSelection
        currentPlayer={currentPlayer}
        draft={draft}
        mapPositions={mapPositions}
        onSelected={setSelection}
        selection={selection}
      />
      <Typography>Faction</Typography>
      <DraftPool
        bans={[]}
        initialPool={draftPool}
        max={1}
        onSelected={([faction]) =>
          setSelection(faction ? { action: 'faction', choice: faction } : null)
        }
        disabled={draft.some(({ action, player }) => action === 'faction' && player === currentPlayer.player)}
        picks={draft
          .filter(({ action }) => action === 'faction')
          .map(({ choice, player }) => ({ pick: choice, playerName: player }))}
        selected={selection?.action !== 'faction' ? [] : [selection.choice]}
      />
      ---
      <pre>{JSON.stringify(selection, null, 2)}</pre>
    </>
  )
}
