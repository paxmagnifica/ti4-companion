import { Box } from '@material-ui/core'
import {
  Block as BanIcon,
  PanTool as PickIcon,
  AssignmentInd as SpeakerIcon,
} from '@material-ui/icons'

import { MapPreview } from '../../../components'
import { SessionNutshell } from '../../SessionNutshell'
import { useDraftQuery } from '../queries'
import { PhaseStepper } from '../components/PhaseStepper'
import { PHASE } from '../shared'

import { Draft } from './Draft'
import { Ban } from './Ban'
import { Speaker } from './Speaker'

export function Drafting({ editable, session, sessionService }) {
  const { draft } = useDraftQuery({
    sessionId: session.id,
    sessionService,
  })

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
        <Speaker
          disabled={!editable}
          draft={draft}
          session={session}
          sessionService={sessionService}
        />
      )}
    </div>
  )
}
