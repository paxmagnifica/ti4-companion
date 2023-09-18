import { Button } from '@material-ui/core'
import { EditPrompt } from '../../../Edit'
import { InlineFactionList } from './InlineFactionList'

export function ActionOnFactionListButton({ action, max, selected, disabled, onClick }) {
  const bansLeft = max - selected.length

  return (
    <EditPrompt>
      <Button
        color="secondary"
        disabled={disabled || bansLeft !== 0}
        onClick={onClick}
        style={{ height: '40px' }}
        variant="contained"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gridColumnGap: '5px',
          }}
        >
          {action} <InlineFactionList factions={selected} />{' '}
          {max !== 1 && bansLeft ? ` (left: ${bansLeft})` : ''}
        </div>
      </Button>
    </EditPrompt>
  )
}
