import { Button } from '@material-ui/core'
import { FactionImage } from '../../../../shared/FactionImage'
import { EditPrompt } from '../../../Edit'

export function BanButton({ max, selected, disabled, onClick }) {
  const bansLeft = max - selected.length

  return (
    <EditPrompt>
      <Button
        color="secondary"
        disabled={disabled || bansLeft !== 0}
        onClick={onClick}
        variant="contained"
    style={{ height: '40px'}}
      >
        <div style={{ display: 'flex', alignItems: 'center', gridColumnGap: '5px' }}>
          ban <InlineFactionList factions={selected} />{' '}
          {max !== 1 && bansLeft ? ` (left: ${bansLeft})` : ''}
        </div>
      </Button>
    </EditPrompt>
  )
}

function InlineFactionList({ factions }) {
  return factions.map((factionKey) => (
    <FactionImage
      factionKey={factionKey}
      style={{ width: 'auto', height: '30px' }}
    />
  ))
}
