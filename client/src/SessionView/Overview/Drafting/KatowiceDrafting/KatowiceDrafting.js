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
import { Draft } from './Draft'

export function KatowiceDrafting({ editable, session, sessionService }) {
  const {
    draft: backendDraft,
    queryInfo: { isFetched: draftReady },
  } = useDraftQuery({
    sessionId: session.id,
    sessionService,
  })
  const draft = {
    ...backendDraft,
    phase: 'pickBan',
    pickBans: [
      {
        player: 'Player 1',
        action: 'ban',
        choice: FACTION.The_Mentak_Coalition,
      },
      { player: 'Player 4', action: 'pick', choice: FACTION.The_Clan_of_Saar },
      {
        player: 'Player 2',
        action: 'ban',
        choice: FACTION.The_Naalu_Collective,
      },
      {
        player: 'Player 5',
        action: 'pick',
        choice: FACTION.The_Embers_of_Muaat,
      },
      { player: 'Player 6', action: 'ban', choice: FACTION.The_Xxcha_Kingdom },
      { player: 'Player 3', action: 'pick', choice: FACTION.The_Nekro_Virus },
      { player: 'Player 3', action: 'ban', choice: FACTION.The_Yssaril_Tribes },
      {
        player: 'Player 6',
        action: 'pick',
        choice: FACTION.The_Emirates_of_Hacan,
      },
      { player: 'Player 5', action: 'ban', choice: FACTION.The_Titans_of_Ul },
      { player: 'Player 2', action: 'pick', choice: FACTION.The_Empyrean },
      {
        player: 'Player 4',
        action: 'ban',
        choice: FACTION.The_VuilRaith_Cabal,
      },
      {
        player: 'Player 1',
        action: 'pick',
        // choice: FACTION.The_Naaz__Rokha_Alliance,
        choice: null,
      },
    ],
    nominations: [
      { player: 'Player 1', action: 'nominate', choice: FACTION.The_Arborec },
      {
        player: 'Player 4',
        action: 'nominate',
        choice: FACTION.The_Ghosts_of_Creuss,
      },
      {
        player: 'Player 2',
        action: 'nominate',
        choice: FACTION.The_L1Z1X_Mindnet,
      },
      {
        player: 'Player 5',
        action: 'confirm',
        choice: FACTION.The_Ghosts_of_Creuss,
      },
      {
        player: 'Player 6',
        action: 'nominate',
        choice: FACTION.The_Universities_of_Jol__Nar,
      },
      {
        player: 'Player 3',
        action: 'confirm',
        choice: FACTION.The_L1Z1X_Mindnet,
      },
      {
        player: 'Player 3',
        action: 'confirm',
        choice: FACTION.The_Universities_of_Jol__Nar,
      },
      {
        player: 'Player 6',
        action: 'nominate',
        choice: FACTION.The_Yin_Brotherhood,
      },
      {
        player: 'Player 5',
        action: 'nominate',
        choice: FACTION.The_Mahact_Gene__Sorcerers,
      },
      {
        player: 'Player 2',
        action: 'nominate',
        choice: FACTION.The_Council_Keleres,
      },
      {
        player: 'Player 4',
        action: 'confirm',
        choice: FACTION.The_Mahact_Gene__Sorcerers,
      },
      {
        player: 'Player 1',
        action: 'confirm',
        choice: FACTION.The_Yin_Brotherhood,
      },
    ],
    draft: [
      { player: 'Player 1', action: 'initiative', choice: 1 },
      {
        player: 'Player 4',
        action: 'faction',
        choice: FACTION.The_Mahact_Gene__Sorcerers,
      },
      { player: 'Player 2', action: 'tablePosition', choice: 3 },
      { player: 'Player 5', action: 'tablePosition', choice: 2 },
      { player: 'Player 6', action: 'initiative', choice: 2 },
      {
        player: 'Player 3',
        action: 'faction',
        choice: FACTION.The_Yin_Brotherhood,
      },
      { player: 'Player 3', action: 'tablePosition', choice: 1 },
      { player: 'Player 6', action: null, choice: null },
      { player: 'Player 5', action: null, choice: null },
      { player: 'Player 2', action: null, choice: null },
      { player: 'Player 4', action: null, choice: null },
      { player: 'Player 1', action: null, choice: null },
      { player: 'Player 1', action: null, choice: null },
      { player: 'Player 4', action: null, choice: null },
      { player: 'Player 2', action: null, choice: null },
      { player: 'Player 5', action: null, choice: null },
      { player: 'Player 6', action: null, choice: null },
      { player: 'Player 3', action: null, choice: null },
    ],
  }

  const { phase } = draft || {}
  // const phase = 'nominations'

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
      {draftReady && phase === 'nominations' && <Nominating {...draft} />}
      {draftReady && phase === 'draft' && (
        <Draft {...draft} mapPositions={session.mapPositions} />
      )}
      ---
      <pre>{JSON.stringify(draft, null, 2)}</pre>
      ---
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}
