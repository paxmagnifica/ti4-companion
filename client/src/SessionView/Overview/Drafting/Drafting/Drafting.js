import { useState, useCallback, useMemo } from 'react'
import { Box, Button, Typography } from '@material-ui/core'
import {
  Block as BanIcon,
  PanTool as PickIcon,
  AssignmentInd as SpeakerIcon,
} from '@material-ui/icons'
import shuffle from 'lodash.shuffle'
import { makeStyles } from '@material-ui/core/styles'

import { useDomainErrors } from '../../../../shared/errorHandling'
import { MapPreview } from '../../../components'
import { EditPrompt } from '../../../Edit'
import { SessionNutshell } from '../../SessionNutshell'
import { DraftPool } from '../DraftPool'
import { useDraftQuery, useDraftMutation } from '../queries'
import { PhaseStepper } from '../components/PhaseStepper'
import { SpeakerIndicator } from '../SpeakerIndicator'
import { PHASE } from '../shared'

import { BanStepper } from './BanStepper'
import { ActionOnFactionListButton } from '../components/ActionOnFactionListButton'
import { Pick } from './Pick'
import { TablePositionPick } from './TablePositionPick'

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

export const useStyles = makeStyles((theme) => ({
  containedButton: {
    transition: theme.transitions.create(
      ['opacity', 'background-color', 'color'],
      {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      },
    ),
    '&:not(.MuiButton-containedSecondary)': {
      backgroundColor: 'white',
    },
    '&:disabled': {
      color: 'black',
      opacity: 0.5,
    },
  },
  banned: {
    backgroundColor: `${theme.palette.error.light} !important`,
    opacity: '0.8 !important',
    '& .MuiButton-endIcon': {
      color: theme.palette.error.contrastText,
    },
  },
  picked: {
    backgroundColor: `${theme.palette.success.light} !important`,
    opacity: '0.8 !important',
    '& .MuiButton-endIcon': {
      color: theme.palette.success.contrastText,
    },
  },
  marginTop: {
    marginTop: theme.spacing(1),
  },
}))

function Ban({
  disabled,
  bans,
  clearSelection,
  draft,
  sessionService,
  session,
}) {
  const { setError } = useDomainErrors()
  const banMutation = useCallback(async () => {
    try {
      await sessionService.pushEvent(session.id, {
        type: 'Banned',
        payload: {
          sessionId: session.id,
          bans,
          playerIndex: draft.order[draft.activePlayerIndex],
          playerName: draft.players[draft.order[draft.activePlayerIndex]],
        },
      })
      clearSelection()
    } catch (e) {
      setError(e)
    }
  }, [bans, setError, sessionService, session.id, draft, clearSelection])

  const { mutate: ban } = useDraftMutation({
    sessionId: session.id,
    mutation: banMutation,
  })

  return (
    <>
      <BanStepper draft={draft} setup={session.setup} />
      <ActionOnFactionListButton
        action="ban"
        disabled={disabled}
        max={draft.bansPerRound}
        onClick={ban}
        selected={bans}
      />
    </>
  )
}

export function Drafting({ editable, session, sessionService }) {
  const [selected, setSelected] = useState([])
  const { draft } = useDraftQuery({
    sessionId: session.id,
    sessionService,
  })

  const bannedFactionKeys = useMemo(
    () => draft?.bans.map(({ ban }) => ban) || [],
    [draft?.bans],
  )

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
      label: 'Pick',
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
          bans={selected}
          clearSelection={() => setSelected([])}
          disabled={!editable}
          draft={draft}
          session={session}
          sessionService={sessionService}
        />
      )}
      {draft.phase === PHASE.picks && (
        <Pick
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
      {draft.phase === PHASE.bans && (
        <DraftPool
          bans={draft.bans}
          disabled={
            !editable ||
            draft.picks.some(
              ({ type, playerIndex }) =>
                type === 'faction' &&
                Number(draft.order[draft.activePlayerIndex]) ===
                  Number(playerIndex),
            )
          }
          initialPool={draft.initialPool}
          max={draft.phase === PHASE.bans ? draft.bansPerRound : 1}
          onSelected={setSelected}
          picks={[]}
          selected={selected}
        />
      )}

      {draft.phase === PHASE.speaker && (
        <DraftPool
          bans={[]}
          disabled
          initialPool={pickedFactionKeys}
          picks={draft.picks}
          selected={selected}
        />
      )}

      {/* show banned factions */}
      {draft.phase !== PHASE.bans && (
        <>
          <Typography>bans:</Typography>
          <DraftPool
            bans={draft.bans}
            disabled
            initialPool={bannedFactionKeys}
            picks={draft.picks}
            selected={selected}
          />
        </>
      )}
    </div>
  )
}
