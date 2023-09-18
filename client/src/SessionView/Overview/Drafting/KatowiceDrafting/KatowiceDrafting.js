import { PhaseStepper } from '../components/PhaseStepper'
import { useDraftQuery } from '../queries'
import {
  Gavel as NominationIcon,
  Block as BanIcon,
  PanTool as PickIcon,
  AddShoppingCart as DraftingIcon,
} from '@material-ui/icons'
import { PickBan } from './PickBan'

export function KatowiceDrafting({ editable, session, sessionService }) {
  const { draft } = useDraftQuery({
    sessionId: session.id,
    sessionService,
  })

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

  return <>
    <PhaseStepper
      phases={phases}
      currentPhase={'pick_ban'}
    />
    <PickBan {...draft} />
    <pre>
      {JSON.stringify(draft, null, 2)}
    </pre>
    ---
    <pre>
      {JSON.stringify(session, null, 2)}
    </pre>
  </>
}
