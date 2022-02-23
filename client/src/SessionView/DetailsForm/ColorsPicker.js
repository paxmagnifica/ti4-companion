import { Trans } from 'react-i18next'
import {
  Typography,
  Select,
  MenuItem,
  FormControl,
  Grid,
  InputLabel,
} from '@material-ui/core'
import { colors as plasticColors } from '../../shared/plasticColors'

export function ColorsPicker({ colors, players, onChange, disabled }) {
  return (
    <>
      <Grid item xs={12}>
        <Typography>
          <Trans i18nKey="sessionDetails.colorsPicker.sectionTitle" />
        </Typography>
      </Grid>
      {players.map(({ faction: factionKey, playerName }) => (
        <Grid key={`color-selector-${factionKey}`} item sm={3} xs={6}>
          <FormControl disabled={disabled} fullWidth>
            <InputLabel
              id={`color-${factionKey}`}
              style={{ color: plasticColors[colors[factionKey]] }}
            >
              <Trans i18nKey={`factions.${factionKey}.name`} />
              {playerName && ` (${playerName})`}
            </InputLabel>
            <Select
              id={`color-${factionKey}`}
              labelId={`color-${factionKey}`}
              onChange={(event) => {
                const { value } = event.target

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
              style={{ color: plasticColors[colors[factionKey]] }}
              value={colors[factionKey] || ''}
            >
              {Object.entries(plasticColors).map(([colorName, color]) => (
                <MenuItem key={colorName} style={{ color }} value={colorName}>
                  <Trans i18nKey={`general.labels.colors.${colorName}`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      ))}
    </>
  )
}
