import { ConfirmPickButton } from './ConfirmPickButton'
import { InlineFactionList } from './InlineFactionList'

export function ActionOnFactionListButton({
  action,
  max,
  selected,
  disabled,
  loading,
  onClick,
}) {
  const factionsLeft = max - selected.length

  return (
    <ConfirmPickButton
      disabled={disabled || factionsLeft !== 0}
      loading={loading}
      onClick={onClick}
    >
      {action} <InlineFactionList factions={selected} />{' '}
      {max !== 1 && factionsLeft ? ` (left: ${factionsLeft})` : ''}
    </ConfirmPickButton>
  )
}
