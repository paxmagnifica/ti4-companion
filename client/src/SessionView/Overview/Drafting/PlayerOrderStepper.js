import clsx from 'clsx'
import { Typography, Stepper, Step, StepLabel } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  ArrowUpward as ActiveIcon,
  AccessibilityNew as PlayerIcon,
  Done as DoneIcon,
} from '@material-ui/icons'

const useStepperStyles = makeStyles((theme) => ({
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
      <Stepper
        activeStep={activePlayer}
        alternativeLabel
        className={classes.root}
      >
        {order.map((label, index) => (
          <Step key={label} color="secondary">
            <StepLabel
              optional={
                index === activePlayer ? (
                  <Typography align="center">
                    <ActiveIcon color="secondary" />
                  </Typography>
                ) : index < activePlayer ? (
                  <Typography align="center">
                    {history[index] || <DoneIcon color="secondary"/>}
                  </Typography>
                ) : null
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
    </>
  )
}
