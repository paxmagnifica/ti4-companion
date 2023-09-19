import {
  Gavel as NominationIcon,
  PanTool as PickIcon,
  AddShoppingCart as DraftingIcon,
} from '@material-ui/icons'
import { Box } from '@material-ui/core'
import { MapPreview } from '../../../components'
import { PhaseStepper } from '../components/PhaseStepper'
import { useKatowiceDraftQuery } from '../queries'
import { PickBan } from './PickBan'
import { Nomination } from './Nomination'
import { Draft } from './Draft'

export function KatowiceDrafting({ editable, session, sessionService }) {
  const {
    draft,
    queryInfo: { isFetched: draftReady },
  } = useKatowiceDraftQuery({
    sessionId: session.id,
    sessionService,
  })

  const { phase } = draft || {}

  const phases = [
    {
      phase: 'pickBan',
      label: 'Pick/Ban',
      icon: <PickIcon />,
    },
    {
      phase: 'nominations',
      label: 'Nominations',
      icon: <NominationIcon />,
    },
    {
      phase: 'draft',
      label: 'Draft',
      icon: <DraftingIcon />,
    },
  ]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gridRowGap: '2em',
        alignItems: 'center',
      }}
    >
      <Box style={{ width: '100%' }}>
        <PhaseStepper currentPhase={phase} phases={phases} />
      </Box>
      <MapPreview map={session.map} />
      {draftReady && phase === 'pickBan' && (
        <PickBan
          {...draft}
          sessionId={session.id}
          sessionService={sessionService}
        />
      )}
      {draftReady && phase === 'nominations' && (
        <Nomination
          {...draft}
          sessionId={session.id}
          sessionService={sessionService}
        />
      )}
      {draftReady && phase === 'draft' && (
        <Draft {...draft} mapPositions={session.mapPositions} />
      )}
    </div>
  )
}
