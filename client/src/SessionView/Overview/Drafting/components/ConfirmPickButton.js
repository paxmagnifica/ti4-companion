import { Button } from '@material-ui/core'
import { EditPrompt } from '../../../Edit'

export function ConfirmPickButton({
  disabled,
  onClick,
  children,
  loading,
  top,
}) {
  return (
    <div style={{ position: 'sticky', top: top || '10px', zIndex: 1101 }}>
      <EditPrompt>
        <Button
          color="secondary"
          disabled={disabled || loading}
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
            {loading && 'loading...'}
          </div>
        </Button>
      </EditPrompt>
    </div>
  )
}
