import {
  Gavel as NominationIcon,
  Block as BanIcon,
  PanTool as PickIcon,
  AddShoppingCart as DraftingIcon,
} from '@material-ui/icons'
import { useState } from 'react'
import { MapPreview } from '../../../components'
import { FACTION } from '../../../../GameComponents/gameInfo/factions'
import { PhaseStepper } from '../components/PhaseStepper'
import { useDraftQuery } from '../queries'
import { PickBan } from './PickBan'

export function KatowiceDrafting({ editable, session, sessionService }) {
  const {
    draft,
    queryInfo: { isFetched: draftReady },
  } = useDraftQuery({
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

  const [pickBans, setPickBans] = useState([
    { player: 'Player 3', action: 'ban', choice: FACTION.The_Titans_of_Ul },
    { player: 'Player 1', action: 'pick', choice: FACTION.The_Clan_of_Saar },
    {
      player: 'Player 5',
      action: 'ban',
      choice: FACTION.The_Universities_of_Jol__Nar,
    },
    { player: 'Player 4', action: 'pick', choice: null },
    { player: 'Player 6', action: 'ban', choice: null },
    { player: 'Player 2', action: 'pick', choice: null },
    { player: 'Player 2', action: 'ban', choice: null },
    { player: 'Player 6', action: 'pick', choice: null },
    { player: 'Player 4', action: 'ban', choice: null },
    { player: 'Player 5', action: 'pick', choice: null },
    { player: 'Player 1', action: 'ban', choice: null },
    { player: 'Player 3', action: 'pick', choice: null },
  ])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gridRowGap: '2em',
        alignItems: 'center',
      }}
    >
      <PhaseStepper currentPhase="pick_ban" phases={phases} />
      <MapPreview map={session.map} />
      {draftReady && <PickBan {...draft} pickBans={pickBans} />}
      <pre>{JSON.stringify(draft, null, 2)}</pre>
      ---
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}
