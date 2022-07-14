import { useMemo } from 'react'
import { Box, FormGroup, Grid, TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { matchSorter } from 'match-sorter'

import { useTranslation } from '../i18n'

import Objective from './Objective'

export function ObjectiveSelector({ disabled, objectives, value, onChange }) {
  const { t } = useTranslation()

  const objectivesWithMeta = useMemo(
    () =>
      Object.values(objectives).map((availableObjective) => ({
        ...availableObjective,
        name: t(`objectives.${availableObjective.slug}.name`),
        condition: t(`objectives.${availableObjective.slug}.condition`),
      })),
    [objectives, t],
  )

  const filterOptions = (options, { inputValue }) =>
    matchSorter(options, inputValue, { keys: ['name', 'condition'] })

  return (
    <Grid container direction="column">
      <Grid item>
        <Box m={1}>
          <FormGroup row>
            <Autocomplete
              defaultValue={objectivesWithMeta.find(
                (obj) => obj.slug === value?.slug,
              )}
              disabled={disabled}
              filterOptions={filterOptions}
              getOptionLabel={(option) => option.name}
              id="search-for-objective"
              onChange={(_, v) => onChange(v)}
              options={objectivesWithMeta}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('general.labels.objective')}
                  variant="outlined"
                />
              )}
              style={{ width: 300 }}
            />
          </FormGroup>
        </Box>
      </Grid>
      {value && (
        <Grid item>
          <Box m={1}>
            <Grid container justifyContent="center">
              <Objective {...value} />
            </Grid>
          </Box>
        </Grid>
      )}
    </Grid>
  )
}
