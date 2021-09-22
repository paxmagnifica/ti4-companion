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
import Autocomplete from '@material-ui/lab/Autocomplete';

import { StateContext } from '../../../state'
import translations from '../../../i18n'
import Objective from '../../../shared/Objective'

function AddObjective({
  open,
  onSelect,
  onCancel,
}) {
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
    const  withMeta = translations.objectivesArray.map(obj => ({ ...obj, ...availableObjectives[obj.slug]}))

    return [
      ...(stageISelected ? withMeta.filter(obj => obj.points === 1 && !obj.secret) : []),
      ...(stageIISelected ? withMeta.filter(obj => obj.points === 2 && !obj.secret) : []),
      ...(secretSelected ? withMeta.filter(obj => obj.secret) : []),
    ]
  }, [availableObjectives, stageISelected, stageIISelected, secretSelected]);

  return <Dialog
    open={open}
    onClose={onCancel}
  >
    <DialogTitle id="form-dialog-title">Add objective</DialogTitle>
    <DialogContent>
      <Box m={1}>
        <FormGroup row>
          <FormControlLabel
            control={<Checkbox checked={stageISelected} onChange={() => setStageI(x => !x)} />}
            label="Stage I"
          />
          <FormControlLabel
            control={<Checkbox checked={stageIISelected} onChange={() => setStageII(x => !x)} />}
            label="Stage II"
          />
          <FormControlLabel
            control={<Checkbox checked={secretSelected} onChange={() => setSecret(x => !x)} />}
            label="Secret"
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
            renderInput={(params) => <TextField {...params} label="Objective" variant="outlined" />}
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
        Add
      </Button>
      <Button onClick={onCancel} color="primary">
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
}

export default AddObjective
