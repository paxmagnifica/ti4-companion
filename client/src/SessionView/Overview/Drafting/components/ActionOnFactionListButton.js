import { ConfirmPickButton } from './ConfirmPickButton'
import { InlineFactionList } from './InlineFactionList'

export function ActionOnFactionListButton({
  action,
  max,
  selected,
  disabled,
  onClick,
}) {
  const bansLeft = max - selected.length

  return (
    <ConfirmPickButton disabled={disabled || bansLeft !== 0} onClick={onClick}>
      {action} <InlineFactionList factions={selected} />{' '}
      {max !== 1 && bansLeft ? ` (left: ${bansLeft})` : ''}
    </ConfirmPickButton>
  )
}
