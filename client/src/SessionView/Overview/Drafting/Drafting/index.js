import { useState, useCallback, useMemo } from 'react'
import { Box, Button, Typography } from '@material-ui/core'
import {
  Block as BanIcon,
  PanTool as PickIcon,
  AssignmentInd as SpeakerIcon,
} from '@material-ui/icons'
import shuffle from 'lodash.shuffle'

import { useDomainErrors } from '../../../../shared/errorHandling'
import { MapPreview } from '../../../components'
import { EditPrompt } from '../../../Edit'
import { SessionNutshell } from '../../SessionNutshell'
import { DraftPool } from '../DraftPool'
import { useDraftQuery, useDraftMutation } from '../queries'
import { PhaseStepper } from '../components/PhaseStepper'
import { SpeakerIndicator } from '../SpeakerIndicator'
import { PHASE } from '../shared'

import { Draft } from './Draft'
import { TablePositionPick } from './TablePositionPick'
import { Ban } from './Ban'

function Speaker({ disabled, draft, session, sessionService }) {
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
      {draft.speaker && (
        <Box mb={2}>
          <EditPrompt>
            <Button
              color="secondary"
              disabled={disabled}
              onClick={commitDraft}
              variant="contained"
            >
              commit draft & start session
            </Button>
          </EditPrompt>
        </Box>
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

export function Drafting({ editable, session, sessionService }) {
  const { draft } = useDraftQuery({
    sessionId: session.id,
    sessionService,
  })

  const pickedFactionKeys = useMemo(
    () =>
      draft?.picks
        .filter(({ type }) => type === 'faction')
        .map(({ pick }) => pick) || [],
    [draft?.picks],
  )

  if (!draft) {
    return null
  }

  const phases = [
    session.setup?.options?.bans
      ? {
          phase: PHASE.bans,
          label: 'Ban',
          icon: <BanIcon />,
        }
      : null,
    {
      phase: PHASE.picks,
      label: 'Draft',
      icon: <PickIcon />,
    },
    session.setup?.options?.speakerPick
      ? null
      : {
          phase: PHASE.speaker,
          label: 'Speaker selection',
          icon: <SpeakerIcon />,
        },
  ].filter(Boolean)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gridRowGap: '2em',
        alignItems: 'center',
      }}
    >
      <SessionNutshell />
      <Box style={{ width: '100%' }}>
        <PhaseStepper currentPhase={draft.phase} phases={phases} />
      </Box>
      <MapPreview map={session.map} />
      {draft.phase === PHASE.bans && (
        <Ban
          disabled={!editable}
          draft={draft}
          session={session}
          sessionService={sessionService}
        />
      )}
      {/*
        yes, phase name is picks, but it's just draft
        (frontend naming change, didn't change and migrate)
      */}
      {draft.phase === PHASE.picks && (
        <Draft
          disabled={!editable}
          draft={draft}
          session={session}
          sessionService={sessionService}
        />
      )}
      {draft.phase === PHASE.speaker && (
        <SpeakerIndicator indicated={draft.speaker} players={draft.players} />
      )}
      {draft.phase === PHASE.speaker && (
        <Speaker
          disabled={!editable}
          draft={draft}
          session={session}
          sessionService={sessionService}
        />
      )}
      {draft.phase === PHASE.speaker && <Typography>picks:</Typography>}
      {session.setup.options.tablePick && draft.phase === PHASE.speaker && (
        <TablePositionPick disabled draft={draft} session={session} />
      )}
      {draft.phase === PHASE.speaker && (
        <DraftPool
          bans={[]}
          disabled
          initialPool={pickedFactionKeys}
          picks={draft.picks}
          selected={[]}
        />
      )}
    </div>
  )
}
