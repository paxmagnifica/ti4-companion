import { Typography } from '@material-ui/core'
import { Trans, useTranslation } from '../../../i18n'
import { Choice } from './components/Choice'
import { PlayerActionsStepper } from './components/PlayerActionsStepper'

export function PickStepper({ draft, mapPositions }) {
  const { t } = useTranslation()

  const steps = draft.order.map((playerIndex, orderIndex) => {
    const pick = draft.picks[orderIndex]
    const stepperAction =
      {
        faction: 'faction',
        speaker: 'initiative',
      }[pick?.type] || 'tablePosition'

    let choice = !pick ? null : pick.type === 'speaker' ? 1 : pick.pick

    if (choice !== null && stepperAction === 'tablePosition') {
      choice = Number(choice)
    }

    return {
      player: draft.players[playerIndex] || 'TBD',
      choice:
        choice === null ? null : (
          <Choice
            action={stepperAction}
            choice={choice}
            mapPositions={mapPositions}
          />
        ),
    }
  })

  return (
    <>
      <Typography align="center" variant="h4">
        <Trans i18nKey={`drafting.speakerOrder.${draft.phase}.title`} />
      </Typography>
      <PlayerActionsStepper steps={steps} />
    </>
  )
}
