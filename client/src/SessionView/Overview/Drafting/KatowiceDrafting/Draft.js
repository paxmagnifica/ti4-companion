import { Grid } from '@material-ui/core'
import { useState } from 'react'
import { FactionImage } from '../../../../shared/FactionImage'
import { PickButton } from '../components/PickButton'
import { PlayerActionsStepper } from '../components/PlayerActionsStepper'
import { TablePositionButton } from '../components/TablePositionButton'
import { DraftPool } from '../DraftPool'

export function Draft({ pickBans, nominations, draft, mapPositions }) {
  const steps = draft.map(({ choice, ...rest }) => ({
    ...rest,
    choice: !choice ? null : (
      <FactionImage
        factionKey={choice}
        style={{ width: 'auto', height: '100%' }}
      />
    ),
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
      <Grid container justifyContent="center" spacing={4}>
        {Array.from(Array(6)).map((_, index) => (
          <Grid key={index} item lg={3} md={4} sm={6} xs={12}>
            <PickButton
              disabled={
                draft.some(
                  ({ player, action }) =>
                    player === currentPlayer.player && action === 'initiative',
                ) ||
                draft.some(
                  ({ action, choice }) =>
                    action === 'initiative' && choice === index + 1,
                )
              }
              onClick={() =>
                setSelection({ action: 'initiative', choice: index + 1 })
              }
              picked={draft.some(
                ({ action, choice }) =>
                  action === 'initiative' && index + 1 === choice,
              )}
              selected={
                selection?.action === 'initiative' &&
                selection?.choice === index + 1
              }
            >
              {index + 1}
            </PickButton>
          </Grid>
        ))}
      </Grid>
      <Grid container justifyContent="center" spacing={4}>
        {mapPositions.map((map, index) => (
          <Grid key={index} item lg={3} md={4} sm={6} xs={12}>
            <TablePositionButton
              disabled={
                draft.some(
                  ({ player, action }) =>
                    player === currentPlayer.player &&
                    action === 'tablePosition',
                ) ||
                draft.some(
                  ({ action, choice }) =>
                    action === 'tablePosition' && choice === index,
                )
              }
              map={map}
              onClick={() =>
                setSelection({ action: 'tablePosition', choice: index })
              }
              picked={draft.some(
                ({ action, choice }) =>
                  action === 'tablePosition' && index === choice,
              )}
              selected={
                selection?.action === 'tablePosition' &&
                selection?.choice === index
              }
            />
          </Grid>
        ))}
      </Grid>
      <DraftPool
        bans={[]}
        initialPool={draftPool}
        max={1}
        onSelected={([faction]) =>
          setSelection(faction ? { action: 'faction', choice: faction } : null)
        }
        picks={[]}
        selected={selection?.action !== 'faction' ? [] : [selection.choice]}
      />
      ---
      <pre>{JSON.stringify(selection, null, 2)}</pre>
    </>
  )
}
