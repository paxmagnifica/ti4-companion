import { useMemo, useCallback, useState } from 'react'
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
} from '@material-ui/core'

import { useTranslation } from '../../../../i18n'
import { ObjectiveSelector } from '../../../../shared/ObjectiveSelector'

function AddObjective({ availableObjectives, open, onSelect, onCancel }) {
  const { t } = useTranslation()

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
    const objectives = Object.values(availableObjectives)

    return [
      ...(stageISelected
        ? objectives.filter((obj) => obj.points === 1 && !obj.secret)
        : []),
      ...(stageIISelected
        ? objectives.filter((obj) => obj.points === 2 && !obj.secret)
        : []),
      ...(secretSelected ? objectives.filter((obj) => obj.secret) : []),
    ]
  }, [availableObjectives, stageISelected, stageIISelected, secretSelected])

  return (
    <Dialog onClose={onCancel} open={open}>
      <DialogTitle id="form-dialog-title">
        {t('publicObjectives.labels.add')}
      </DialogTitle>
      <DialogContent>
        <Box m={1}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={stageISelected}
                  onChange={() => setStageI((x) => !x)}
                />
              }
              label={t('general.labels.stageI')}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={stageIISelected}
                  onChange={() => setStageII((x) => !x)}
                />
              }
              label={t('general.labels.stageII')}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={secretSelected}
                  onChange={() => setSecret((x) => !x)}
                />
              }
              label={t('general.labels.secretObj')}
            />
          </FormGroup>
        </Box>
        <ObjectiveSelector
          objectives={filteredObjectives}
          onChange={setSelected}
          value={selected}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={select}>{t('general.labels.add')}</Button>
        <Button color="primary" onClick={onCancel}>
          {t('general.labels.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddObjective
