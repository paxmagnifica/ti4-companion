import { useMemo, useContext, useCallback, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useTranslation } from 'react-i18next'

import { StateContext } from '../../../state'
import Objective from '../../../shared/Objective'

function AddObjective({
  open,
  onSelect,
  onCancel,
}) {
  const { t } = useTranslation()
  const { objectives: { data: availableObjectives } } = useContext(StateContext)

  const [stageISelected, setStageI] = useState(true)
  const [stageIISelected, setStageII] = useState(false)
  const [secretSelected, setSecret] = useState(false)
  const [selected, setSelected] = useState(null)

  const select = useCallback(() => {
    if (!selected) {
      return
    }

   onSelect(selected)
  }, [selected, onSelect])

  const filteredObjectives = useMemo(() => {
    const withMeta = Object.values(availableObjectives).map(availableObjective => ({
      ...availableObjective,
      name: t(`objectives.${availableObjective.slug}.name`),
      condition: t(`objectives.${availableObjective.slug}.condition`),
    }))

    return [
      ...(stageISelected ? withMeta.filter(obj => obj.points === 1 && !obj.secret) : []),
      ...(stageIISelected ? withMeta.filter(obj => obj.points === 2 && !obj.secret) : []),
      ...(secretSelected ? withMeta.filter(obj => obj.secret) : []),
    ]
  }, [availableObjectives, stageISelected, stageIISelected, secretSelected, t]);

  return <Dialog
    open={open}
    onClose={onCancel}
  >
    <DialogTitle id="form-dialog-title">{t('publicObjectives.labels.add')}</DialogTitle>
    <DialogContent>
      <Box m={1}>
        <FormGroup row>
          <FormControlLabel
            control={<Checkbox checked={stageISelected} onChange={() => setStageI(x => !x)} />}
            label={t('general.labels.stageI')}
          />
          <FormControlLabel
            control={<Checkbox checked={stageIISelected} onChange={() => setStageII(x => !x)} />}
            label={t('general.labels.stageII')}
          />
          <FormControlLabel
            control={<Checkbox checked={secretSelected} onChange={() => setSecret(x => !x)} />}
            label={t('general.labels.secretObj')}
          />
        </FormGroup>
      </Box>
      <Box m={1}>
        <FormGroup row>
          <Autocomplete
            id="search-for-objective"
            options={filteredObjectives}
            getOptionLabel={(option) => option.name}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label={t('general.labels.objective')} variant="outlined" />}
            onChange={(event, value, reason) => setSelected(value)}
          />
        </FormGroup>
      </Box>
      { selected && <Box m={1}><Grid container justifyContent='center'>
        <Objective {...selected} />
      </Grid></Box> }
    </DialogContent>
    <DialogActions>
      <Button onClick={select}>
        {t('general.labels.add')}
      </Button>
      <Button onClick={onCancel} color="primary">
        {t('general.labels.cancel')}
      </Button>
    </DialogActions>
  </Dialog>
}

export default AddObjective
