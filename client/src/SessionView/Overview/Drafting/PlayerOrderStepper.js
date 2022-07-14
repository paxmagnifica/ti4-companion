import clsx from 'clsx'
import { Typography, Stepper, Step, StepLabel } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  ArrowUpward as ActiveIcon,
  AccessibilityNew as PlayerIcon,
  Done as DoneIcon,
} from '@material-ui/icons'

const useStepperStyles = makeStyles(() => ({
  root: {
    backgroundColor: 'transparent',
  },
  done: {
    opacity: 0.7,
  },
}))

export function PlayerOrderStepper({ history, order, activePlayer, title }) {
  const classes = useStepperStyles()

  return (
    <>
      <Typography align="center" variant="h4">
        {title}
      </Typography>
      <div style={{ maxWidth: '100%', overflow: 'auto' }}>
        <Stepper
          activeStep={activePlayer}
          alternativeLabel
          className={classes.root}
        >
          {order.map((label, index) => (
            <Step color="secondary">
              <StepLabel
                optional={
                  <Typography
                    align="center"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '3em',
                    }}
                  >
                    {index === activePlayer ? (
                      <ActiveIcon color="secondary" />
                    ) : index < activePlayer ? (
                      history[index] || <DoneIcon color="secondary" />
                    ) : null}
                  </Typography>
                }
                StepIconComponent={PlayerIcon}
                StepIconProps={{
                  className: clsx({ [classes.done]: index < activePlayer }),
                }}
              >
                <Typography
                  className={clsx({ [classes.done]: index < activePlayer })}
                >
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
    </>
  )
}
