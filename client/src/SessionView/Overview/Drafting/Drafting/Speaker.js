import { useCallback } from 'react'
import { Button } from '@material-ui/core'
import shuffle from 'lodash.shuffle'
import { useDomainErrors } from '../../../../shared/errorHandling'
import { EditPrompt } from '../../../Edit'
import { useDraftMutation } from '../queries'
import { SpeakerIndicator } from '../SpeakerIndicator'
import { ConfirmPickButton } from '../components/ConfirmPickButton'

export function Speaker({ disabled, draft, session, sessionService }) {
  const { setError } = useDomainErrors()
  const speakerMutation = useCallback(async () => {
    const shuffled = shuffle([...Array(draft.players.length).keys()])

    const speakerIndex = shuffled[0]
    const speakerName = draft.players[speakerIndex]

    try {
      await sessionService.pushEvent(session.id, {
        type: 'SpeakerSelected',
        payload: {
          sessionId: session.id,
          speakerIndex,
          speakerName,
        },
      })
    } catch (e) {
      setError(e)
    }
  }, [setError, sessionService, session.id, draft])

  const { mutate: selectRandomSpeaker } = useDraftMutation({
    sessionId: session.id,
    mutation: speakerMutation,
  })

  const commitDraftMutation = useCallback(async () => {
    try {
      await sessionService.pushEvent(session.id, {
        type: 'CommitDraft',
      })
    } catch (e) {
      setError(e)
    }
  }, [session.id, setError, sessionService])

  const { mutate: commitDraft } = useDraftMutation({
    sessionId: session.id,
    mutation: commitDraftMutation,
  })

  return (
    <>
      <SpeakerIndicator indicated={draft.speaker} players={draft.players} />
      {draft.speaker && (
        <ConfirmPickButton disabled={disabled} onClick={commitDraft}>
          commit draft and start session
        </ConfirmPickButton>
      )}
      <EditPrompt>
        <Button
          color="primary"
          disabled={disabled}
          onClick={selectRandomSpeaker}
          variant="contained"
        >
          assign speaker at random
        </Button>
      </EditPrompt>
    </>
  )
}
