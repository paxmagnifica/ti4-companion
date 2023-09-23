import {
  Avatar,
  Button,
  ButtonGroup,
  IconButton,
  makeStyles,
} from '@material-ui/core'
import { Info as InfoIcon } from '@material-ui/icons'
import clsx from 'clsx'
import { useTranslation } from '../../../../i18n'
import { useFactionData } from '../../../../GameComponents'
import { EditPrompt } from '../../../Edit'
import { HighlightedText } from '../../../../shared/searchWithHighlight'

const useStyles = makeStyles((theme) => ({
  containedButton: {
    transition: theme.transitions.create(
      ['opacity', 'background-color', 'color'],
      {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      },
    ),
    '&:not(.MuiButton-containedSecondary)': {
      backgroundColor: 'white',
    },
    '&:disabled': {
      color: 'black',
      opacity: 0.5,
    },
  },
  infoButton: {
    borderTopRightRadius: '4px !important',
    borderBottomRightRadius: '4px !important',
    backgroundColor: 'rgba(255, 255, 255, 0.1) !important',
  },
  banned: {
    backgroundColor: `${theme.palette.error.light} !important`,
    opacity: '0.8 !important',
    '& .MuiButton-endIcon': {
      color: theme.palette.error.contrastText,
    },
  },
  picked: {
    backgroundColor: `${theme.palette.success.light} !important`,
    opacity: '0.8 !important',
    '& .MuiButton-endIcon': {
      color: theme.palette.success.contrastText,
    },
  },
  highlighted: {
    backgroundColor: `${theme.palette.primary.light} !important`,
  },
}))

export function FactionButton({
  onClick,
  onInfoClick,
  selected,
  banned,
  picked,
  disabled,
  factionKey,
  highlighted,
  highlightText,
}) {
  const classes = useStyles()
  const { getData } = useFactionData()
  const { t } = useTranslation()

  return (
    <ButtonGroup
      color={selected ? 'secondary' : 'default'}
      fullWidth
      variant="contained"
    >
      <EditPrompt fullWidth>
        <Button
          className={clsx(classes.containedButton, {
            [classes.banned]: banned,
            [classes.picked]: picked,
            [classes.highlighted]: !selected && highlighted,
          })}
          color={selected && !disabled ? 'secondary' : 'default'}
          disabled={Boolean(disabled || banned || picked)}
          fullWidth
          onClick={onClick}
          startIcon={
            <Avatar
              alt={getData(factionKey).name}
              src={getData(factionKey).image}
            />
          }
          variant="contained"
        >
          <HighlightedText highlight={highlightText}>
            {t(`factions.${factionKey}.name`)}
          </HighlightedText>
        </Button>
      </EditPrompt>
      <IconButton
        className={clsx(classes.containedButton, classes.infoButton)}
        onClick={onInfoClick}
      >
        <InfoIcon fontSize="large" />
      </IconButton>
    </ButtonGroup>
  )
}
