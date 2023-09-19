import { Grid, Typography } from '@material-ui/core'
import { useState } from 'react'
import { FactionImage } from '../../../../shared/FactionImage'
import speakerFront from '../../../../assets/speaker-front.png'
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

function InitiativeSelection({ draft, selection, onSelected, currentPlayer }) {
  return (
    <>
      <Typography>Initiative</Typography>
      <Grid container justifyContent="center" spacing={4}>
        {Array.from(Array(6)).map((_, index) => {
          const pick = draft.find(
            ({ action, choice }) =>
              action === 'initiative' && index + 1 === choice,
          )

          return (
            <Grid key={index} item lg={3} md={4} sm={6} xs={12}>
              <PickButton
                disabled={
                  draft.some(
                    ({ player, action }) =>
                      player === currentPlayer.player &&
                      action === 'initiative',
                  ) ||
                  draft.some(
                    ({ action, choice }) =>
                      action === 'initiative' && choice === index + 1,
                  )
                }
                onClick={() =>
                  onSelected({ action: 'initiative', choice: index + 1 })
                }
                picked={pick ? { playerName: pick.player } : false}
                selected={
                  selection?.action === 'initiative' &&
                  selection?.choice === index + 1
                }
              >
                {index === 0 && (
                  <img
                    src={speakerFront}
                    style={{ height: '100%', width: 'auto' }}
                  />
                )}
                {index === 1 ? '2nd' : null}
                {index === 2 ? '3rd' : null}
                {index > 2 ? `${index + 1}th` : null}
              </PickButton>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}

function TablePositionSelection({
  mapPositions,
  draft,
  currentPlayer,
  onSelected,
  selection,
}) {
  return (
    <>
      <Typography>Map</Typography>
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
                onSelected({ action: 'tablePosition', choice: index })
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
    </>
  )
}
