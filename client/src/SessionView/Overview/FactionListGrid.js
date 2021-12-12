import { useCallback, useState } from 'react'
import { Avatar, Button, Grid } from '@material-ui/core'
import { Trans } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  containedButton: {
    '&:not(.MuiButton-containedSecondary)': {
      backgroundColor: 'white',
    },
  },
})

export function FactionListGrid({
  factions,
  inactive,
  selected,
  onSelected,
  max,
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
      {factions.map((faction) => (
        <Grid key={faction.key} item lg={3} md={4} sm={6} xs={12}>
          <Button
            className={classes.containedButton}
            color={isSelected(faction.key) ? 'secondary' : 'default'}
            disabled={
              selected.length === max && !selected.includes(faction.key)
            }
            fullWidth
            onClick={() => toggleSelection(faction.key)}
            startIcon={<Avatar alt={faction.name} src={faction.image} />}
            variant="contained"
          >
            <Trans i18nKey={`factions.${faction.key}.name`} />
          </Button>
        </Grid>
      ))}
    </Grid>
  )
}
