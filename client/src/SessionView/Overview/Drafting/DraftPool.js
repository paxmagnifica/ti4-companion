import { useCallback, useState } from 'react'
import {
  IconButton,
  ButtonGroup,
  Typography,
  Avatar,
  Button,
  Grid,
} from '@material-ui/core'
import { Info as InfoIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import { Trans } from '../../../i18n'
import { useFactionData } from '../../../GameComponents'
import { EditPrompt } from '../../Edit'
import { FactionNutshell } from '../FactionNutshell'

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
}))

export function DraftPool({
  initialPool,
  bans,
  picks,
  max,
  onSelected,
  selected,
  disabled,
}) {
  const classes = useStyles()
  const isSelected = useCallback(
    (factionKey) => selected.includes(factionKey),
    [selected],
  )
  const singleSelection = max === 1
  const toggleSelection = useCallback(
    (factionKey) => {
      if (singleSelection) {
        onSelected([factionKey])

        return
      }

      if (isSelected(factionKey)) {
        onSelected(selected.filter((faction) => faction !== factionKey))

        return
      }

      onSelected([...selected, factionKey])
    },
    [selected, onSelected, isSelected],
  )
  const [nutshellFactionKey, setFactionNutshellKey] = useState(null)
  const { getData } = useFactionData()

  return (
    <>
      <Grid container justifyContent="center" spacing={4}>
        {initialPool.map((factionKey) => {
          const picked = picks.find(({ pick }) => pick === factionKey)
          const banned = bans.find(({ ban }) => ban === factionKey)
          const disabledDueToSelection =
            !singleSelection &&
            selected.length === max &&
            !selected.includes(factionKey)

          return (
            <Grid key={factionKey} item lg={3} md={4} sm={6} xs={12}>
              <ButtonGroup
                color={isSelected(factionKey) ? 'secondary' : 'default'}
                fullWidth
                variant="contained"
              >
                <EditPrompt fullWidth>
                  <Button
                    className={clsx(classes.containedButton, {
                      [classes.banned]: banned,
                      [classes.picked]: picked,
                    })}
                    color={isSelected(factionKey) ? 'secondary' : 'default'}
                    disabled={Boolean(
                      disabled || banned || disabledDueToSelection || picked,
                    )}
                    fullWidth
                    onClick={() => toggleSelection(factionKey)}
                    startIcon={
                      <Avatar
                        alt={getData(factionKey).name}
                        src={getData(factionKey).image}
                      />
                    }
                    variant="contained"
                  >
                    <Trans i18nKey={`factions.${factionKey}.name`} />
                    {banned && (
                      <Typography variant="caption">
                        banned by {banned.playerName}
                      </Typography>
                    )}
                    {picked && (
                      <Typography variant="caption">
                        picked by {picked.playerName}
                      </Typography>
                    )}
                  </Button>
                </EditPrompt>
                <IconButton
                  className={clsx(classes.containedButton, classes.infoButton)}
                  onClick={() => setFactionNutshellKey(factionKey)}
                >
                  <InfoIcon fontSize="large" />
                </IconButton>
              </ButtonGroup>
            </Grid>
          )
        })}
      </Grid>
      <FactionNutshell
        factionKey={nutshellFactionKey}
        onClose={() => setFactionNutshellKey(null)}
      />
    </>
  )
}
