import { Typography } from '@material-ui/core'
import { useCallback, useState } from 'react'
import { PlayerActionsStepper } from '../components/PlayerActionsStepper'
import { DraftPool } from '../DraftPool'
import { TablePositionSelection } from './components/TablePositionSelection'
import { InitiativeSelection } from './components/InitiativeSelection'
import { Choice } from './components/Choice'
import { ConfirmPickButton } from '../components/ConfirmPickButton'
import { useDomainErrors } from '../../../../shared/errorHandling'
import { useDraftMutation } from '../queries'
import { CONFIRM_BUTTON_TOP } from './shared'
import { CheckPlayerPicks } from './CheckPlayerPicks'

export function Draft({
  pickBans,
  nominations,
  draft,
  mapPositions,
  sessionService,
  sessionId,
}) {
  const steps = draft.map(({ choice, action, ...rest }) => ({
    ...rest,
    choice:
      choice === null ? null : (
        <Choice action={action} choice={choice} mapPositions={mapPositions} />
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

  const { setError } = useDomainErrors()
  const draftPickMutation = useCallback(async () => {
    try {
      if (!selection) {
        return
      }

      await sessionService.pushEvent(sessionId, {
        type: 'DraftPick',
        payload: {
          action: selection.action,
          choice: selection.choice,
          playerIndex: currentPlayer.index,
        },
      })
      setSelection(null)
    } catch (e) {
      setError(e)
    }
  }, [sessionId, setError, sessionService, selection, currentPlayer])

  const { mutate: draftPick, isLoading: loading } = useDraftMutation({
    sessionId,
    mutation: draftPickMutation,
  })

  return (
    <>
      <PlayerActionsStepper steps={steps} />
      <div
        style={{
          display: 'flex',
          gridColumnGap: '1em',
          position: 'sticky',
          top: CONFIRM_BUTTON_TOP,
          zIndex: 1101,
        }}
      >
        <CheckPlayerPicks />
        <ConfirmPickButton
          disabled={selection === null}
          loading={loading}
          onClick={draftPick}
        >
          confirm{' '}
          {selection && (
            <Choice
              action={selection.action}
              choice={selection.choice}
              height="30px"
              mapPositions={mapPositions}
            />
          )}
        </ConfirmPickButton>
      </div>
      <InitiativeSelection
        currentPlayer={currentPlayer}
        disabled={loading}
        draft={draft}
        onSelected={setSelection}
        selection={selection}
      />
      <TablePositionSelection
        currentPlayer={currentPlayer}
        disabled={loading}
        draft={draft}
        mapPositions={mapPositions}
        onSelected={setSelection}
        selection={selection}
      />
      <Typography>Faction</Typography>
      <DraftPool
        bans={[]}
        disabled={
          loading ||
          draft.some(
            ({ action, player }) =>
              action === 'faction' && player === currentPlayer.player,
          )
        }
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
    </>
  )
}
