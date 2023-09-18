import clsx from 'clsx'
import { StepConnector, Stepper, Step, StepLabel } from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  completed: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector)

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  },
})

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles()
  const { active, completed, icon, icons } = props

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[icon - 1]}
    </div>
  )
}

const useStepperStyles = makeStyles((_theme) => ({
  root: {
    backgroundColor: 'transparent',
    padding: 0,
  },
}))

export function PhaseStepper({ phases, currentPhase }) {
  const classes = useStepperStyles()

  const icons = phases.map(({ icon }) => icon)
  const activeStep = phases.findIndex(({ phase }) => phase === currentPhase)

  return (
    <Stepper
      activeStep={activeStep}
      alternativeLabel
      className={classes.root}
      connector={<ColorlibConnector />}
    >
      {phases.map(({ label }) => (
        <Step key={label} color="secondary">
          <StepLabel
            StepIconComponent={ColorlibStepIcon}
            StepIconProps={{ icons }}
          >
            {label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}
