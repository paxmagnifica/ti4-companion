import {
  Gavel as NominationIcon,
  PanTool as PickIcon,
  AddShoppingCart as DraftingIcon,
} from '@material-ui/icons'
import { Box } from '@material-ui/core'
import { MapPreview } from '../../../components'
import { FACTION } from '../../../../GameComponents/gameInfo/factions'
import { PhaseStepper } from '../components/PhaseStepper'
import { useDraftQuery } from '../queries'
import { PickBan } from './PickBan'
import { Nominating } from './Nominating'

export function KatowiceDrafting({ editable, session, sessionService }) {
  const {
    draft,
    queryInfo: { isFetched: draftReady },
  } = useDraftQuery({
    sessionId: session.id,
    sessionService,
  })

  // const { phase } = (draft || {})
  const phase = 'nominations'

  const phases = [
    {
      phase: 'pick_ban',
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
      {draftReady && phase === 'pick_ban' && <PickBan {...draft} />}
      {draftReady && phase === 'nominations' && <Nominating {...draft} />}
      ---
      <pre>{JSON.stringify(draft, null, 2)}</pre>
      ---
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}
