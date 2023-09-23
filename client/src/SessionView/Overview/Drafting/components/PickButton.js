import { Button, makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { PanTool as PickIcon } from '@material-ui/icons'
import { EditPrompt } from '../../../Edit'

export const useStyles = makeStyles((theme) => ({
  containedButton: {
    transition: theme.transitions.create(
      ['opacity', 'background-color', 'color'],
      {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      },
    ),
    display: 'flex',
    '&:not(.MuiButton-containedSecondary)': {
      backgroundColor: 'white',
    },
    '&:disabled': {
      color: 'black',
      opacity: 0.5,
    },
  },
  picked: {
    backgroundColor: `${theme.palette.success.light} !important`,
    opacity: '0.8 !important',
    '& .MuiButton-endIcon': {
      color: theme.palette.success.contrastText,
    },
  },
}))

export function PickButton({ picked, selected, onClick, disabled, children }) {
  const classes = useStyles()

  return (
    <EditPrompt fullWidth>
      <Button
        className={clsx(classes.containedButton, {
          [classes.picked]: picked,
        })}
        color={selected ? 'secondary' : 'default'}
        disabled={Boolean(disabled || picked)}
        endIcon={picked ? <PickIcon fontSize="large" /> : null}
        fullWidth
        onClick={onClick}
        variant="contained"
      >
        <div
          style={{
            height: '42px',
            width: 'auto',
            display: 'flex',
            alignItems: 'center',
            gridColumnGap: '0.3em',
          }}
        >
          {children}
          {picked?.playerName && (
            <Typography style={{ marginLeft: '0.3em' }} variant="caption">
              picked by {picked.playerName}
            </Typography>
          )}
        </div>
      </Button>
    </EditPrompt>
  )
}
