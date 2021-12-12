import { useCallback, useState } from 'react'
import { Typography, Avatar, Button, Grid } from '@material-ui/core'
import { Block as BlockIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { Trans } from 'react-i18next'
import clsx from 'clsx'

import { getData } from '../../gameInfo/factions'

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
}))

export function DraftPool({
  initialPool,
  bans,
  picks,
  max,
  onSelected,
  selected,
}) {
  const classes = useStyles()
  const isSelected = useCallback(
    (factionKey) => selected.includes(factionKey),
    [selected],
  )
  const toggleSelection = useCallback(
    (factionKey) => {
      if (isSelected(factionKey)) {
        onSelected(selected.filter((faction) => faction !== factionKey))

        return
      }

      onSelected([...selected, factionKey])
    },
    [selected, onSelected, isSelected],
  )

  return (
    <Grid container justifyContent="center" spacing={4}>
      {initialPool.map((factionKey) => {
        const banned = bans.find((ban) => ban.faction === factionKey)
        const disabledDueToSelection =
          selected.length === max && !selected.includes(factionKey)

        return (
          <Grid key={factionKey} item lg={3} md={4} sm={6} xs={12}>
            <Button
              className={clsx(classes.containedButton, {
                [classes.banned]: banned,
              })}
              color={isSelected(factionKey) ? 'secondary' : 'default'}
              disabled={banned || disabledDueToSelection}
              endIcon={
                banned ? <BlockIcon color="error" fontSize="large" /> : null
              }
              fullWidth
              onClick={() => toggleSelection(factionKey)}
              startIcon={
                <Avatar
                  alt={getData(factionKey).name}
                  src={getData(factionKey).image}
                />
              }
              title={banned ? 'Banned' : ''}
              variant="contained"
            >
              <Trans i18nKey={`factions.${factionKey}.name`} />
              {banned && (
                <Typography variant="caption">
                  banned by {banned.playerName}
                </Typography>
              )}
            </Button>
          </Grid>
        )
      })}
    </Grid>
  )
}
