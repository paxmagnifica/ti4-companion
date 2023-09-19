import { Button } from '@material-ui/core'
import { EditPrompt } from '../../../Edit'

export function ConfirmPickButton({ disabled, onClick, children }) {
  return (
    <div style={{ position: 'sticky', top: '10px', zIndex: 2 }}>
      <EditPrompt>
        <Button
          color="secondary"
          disabled={disabled}
          onClick={onClick}
          style={{ height: '40px' }}
          variant="contained"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gridColumnGap: '5px',
              height: '100%',
            }}
          >
            {children}
          </div>
        </Button>
      </EditPrompt>
    </div>
  )
}
