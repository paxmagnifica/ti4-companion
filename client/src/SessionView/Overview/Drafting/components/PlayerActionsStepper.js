import { useEffect, useRef } from 'react'
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
    padding: 0,
  },
  done: {
    opacity: 0.7,
  },
  action: {
    fontSize: '0.7rem',
  },
}))

export function PlayerActionsStepper({ steps }) {
  const classes = useStepperStyles()
  const firstStepRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const activePlayer = steps.findIndex(({ choice }) => choice === null)

  useEffect(() => {
    if (!firstStepRef.current || !scrollContainerRef.current) {
      return
    }

    const firstStepRect = firstStepRef.current.getBoundingClientRect()
    const stepWidth = firstStepRect.width

    scrollContainerRef.current.scroll((activePlayer - 1) * stepWidth, 0)
  }, [activePlayer])

  return (
    <>
      <div
        ref={scrollContainerRef}
        style={{ maxWidth: '100%', overflow: 'auto' }}
      >
        <Stepper
          activeStep={activePlayer}
          alternativeLabel
          className={classes.root}
        >
          {steps.map(({ player, action, choice }, index) => (
            <Step
              ref={index === 0 ? firstStepRef : undefined}
              color="secondary"
            >
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
                      choice || <DoneIcon color="secondary" />
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
                  {player}
                </Typography>
                {action && (
                  <Typography
                    className={clsx({
                      [classes.done]: index < activePlayer,
                      [classes.action]: true,
                    })}
                  >
                    ({action})
                  </Typography>
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
    </>
  )
}
