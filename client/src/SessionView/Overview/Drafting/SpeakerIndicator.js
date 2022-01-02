import clsx from 'clsx'
import { Typography, Stepper, Step, StepLabel } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  AccessibilityNew as PlayerIcon,
  AssignmentInd as SpeakerIcon,
} from '@material-ui/icons'

const useStepperStyles = makeStyles({
  root: {
    backgroundColor: 'transparent',
  },
  done: {
    opacity: 0.7,
  },
})

export function SpeakerIndicator({ players, indicated }) {
  const classes = useStepperStyles()
  const indicatedIndex = players.findIndex((p) => p === indicated)

  return (
    <>
      <Stepper activeStep={indicated} alternativeLabel className={classes.root}>
        {players.map((label, index) => (
          <Step key={label} color="secondary">
            <StepLabel
              optional={
                index === indicatedIndex ? (
                  <Typography align="center">
                    <SpeakerIcon color="secondary" />
                  </Typography>
                ) : null
              }
              StepIconComponent={PlayerIcon}
              StepIconProps={{
                className: clsx({
                  [classes.done]:
                    indicatedIndex >= 0 && index !== indicatedIndex,
                }),
              }}
            >
              <Typography
                className={clsx({
                  [classes.done]:
                    indicatedIndex >= 0 && index !== indicatedIndex,
                })}
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
