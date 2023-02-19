import { Typography, Grid, TextField } from '@material-ui/core'

import { useTranslation, Trans } from '../../i18n'
import { ColorPicker } from '../../shared/ColorPicker'

export function ColorsPicker({ colors, players, onChange, disabled }) {
  const { t } = useTranslation()

  return (
    <>
      <Grid item xs={12}>
        <Typography>
          <Trans i18nKey="sessionDetails.colorsPicker.sectionTitle" />
        </Typography>
      </Grid>
      <Grid item style={{ display: 'flex', gridColumnGap: '1em' }} xs={12}>
        {players.map(({ faction: factionKey, playerName }) => (
          <div key={factionKey} style={{ display: 'flex' }}>
            <TextField
              color="secondary"
              disabled
              label={playerName}
              value={t(`factions.${factionKey}.name`)}
              variant="filled"
            />
            <ColorPicker
              color={colors[factionKey] || null}
              disabled={disabled}
              onChange={(value) => {
                onChange((oldColors) => {
                  const factionWithThisColor = Object.entries(oldColors).find(
                    ([, colorName]) => colorName === value,
                  )

                  return {
                    ...oldColors,
                    ...(factionWithThisColor
                      ? { [factionWithThisColor[0]]: '' }
                      : {}),
                    [factionKey]: value,
                  }
                })
              }}
              style={{ marginLeft: '0.3em' }}
            />
          </div>
        ))}
      </Grid>
    </>
  )
}
