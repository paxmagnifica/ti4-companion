import { useState, useCallback, useMemo } from 'react'
import { useDomainErrors } from '../../../../shared/errorHandling'
import { useDraftMutation } from '../queries'
import { PickStepper } from './PickStepper'
import { SpeakerSelectorToggle } from "./SpeakerSelectorToggle"
import { TablePositionPick } from "./TablePositionPick"
import { DraftPool } from '../DraftPool'
import { Choice } from '../components/Choice'
import { ConfirmPickButton } from '../components/ConfirmPickButton'

export function Pick({
  disabled,
  draft,
  session,
  sessionService,
}) {
  const [selection, setSelection] = useState(null)

  const { setError } = useDomainErrors()
  const [loading, setLoading] = useState(false)

  const confirmPickMutation = useCallback(async () => {
    setLoading(true)
    let eventPick = selection.choice
    if (selection.action === 'speaker') {
      eventPick = 'speaker'
    }

    let eventType = selection.action
    try {
      await sessionService.pushEvent(session.id, {
        type: 'Picked',
        payload: {
          sessionId: session.id,
          pick: eventPick,
          type: eventType,
          playerIndex: draft.order[draft.activePlayerIndex],
          playerName: draft.players[draft.order[draft.activePlayerIndex]],
        },
      })
      setSelection(null)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [selection, session.id, draft])

  const { mutate: confirmPick } = useDraftMutation({
    sessionId: session.id,
    mutation: confirmPickMutation,
  })

  const bannedFactionKeys = useMemo(
    () => draft?.bans.map(({ ban }) => ban) || [],
    [draft?.bans],
  )

  return (
    <>
      <PickStepper draft={draft} mapPositions={session.mapPositions} />
      <ConfirmPickButton
        disabled={selection === null}
        loading={loading}
        onClick={confirmPick}
      >
        confirm{' '}
        {selection && (
          <Choice
            action={selection.action}
            choice={selection.choice}
            height="30px"
            mapPositions={session.mapPositions}
          />
        )}
      </ConfirmPickButton>
      {session.setup.options.speakerPick && (
        <SpeakerSelectorToggle
          cannotSelect={draft.picks.some(({ type }) => type === 'speaker')}
          disabled={disabled}
          onChange={() => setSelection({ action: 'speaker' })}
          selected={selection?.action === 'speaker'}
        />
      )}
      {session.setup.options.tablePick && (
        <TablePositionPick
          disabled={
            disabled ||
            draft.picks.some(
              ({ type, playerIndex }) =>
                type === 'tablePosition' &&
                Number(draft.order[draft.activePlayerIndex]) ===
                  Number(playerIndex),
            )
          }
          draft={draft}
          handleSelectedPosition={(position) => setSelection({ action: 'tablePosition', choice: position })}
          selectedPosition={selection?.action === 'tablePosition' ? selection.choice : null }
          session={session}
        />
      )}
      <DraftPool
        bans={[]}
        disabled={
          disabled ||
          draft.picks.some(
            ({ type, playerIndex }) =>
              type === 'faction' &&
              Number(draft.order[draft.activePlayerIndex]) ===
                Number(playerIndex),
          )
        }
        initialPool={draft.initialPool.filter(
          (factionKey) => !bannedFactionKeys.includes(factionKey),
        )}
        max={1}
        onSelected={(faction) => setSelection({ action: 'faction', choice: faction[0], })}
        picks={draft.picks}
        selected={selection?.action === 'faction' ? [selection.choice] : []}
      />
    </>
  )
}
