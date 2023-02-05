import { Map as MapIcon } from '@material-ui/icons'

import speakerFront from '../../../assets/speaker-front.png'
import { FactionImage } from '../../../shared/FactionImage'
import { getMapPositionName } from '../../../shared'
import { useTranslation } from '../../../i18n'
import { PlayerOrderStepper } from './PlayerOrderStepper'

export function PickStepper({ draft }) {
  const { t } = useTranslation()

  const history = draft.picks.map(({ type, pick }) => {
    switch (type) {
      case 'faction':
        return (
          <FactionImage
            factionKey={pick}
            style={{ width: 'auto', height: '100%' }}
          />
        )
      case 'speaker':
        return (
          <img
            alt="speaker"
            src={speakerFront}
            style={{ height: 'auto', width: '100%' }}
          />
        )
      default:
        return (
          <>
            <MapIcon />{' '}
            {getMapPositionName({
              mapPositions: draft.mapPositions,
              position: pick,
            })}
          </>
        )
    }
  })

  return (
    <PlayerOrderStepper
      activePlayer={draft.activePlayerIndex}
      history={history}
      order={draft.order.map(
        (playerIndex) => draft.players[playerIndex] || 'TBD',
      )}
      title={t(`drafting.speakerOrder.${draft.phase}.title`)}
    />
  )
}
