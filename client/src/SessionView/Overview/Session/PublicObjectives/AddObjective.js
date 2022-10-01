import { useMemo, useCallback, useState } from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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

  const selectStageI = useCallback(() => {
    setStageI(true)
    setStageII(false)
    setSecret(false)
  }, [])

  const selectStageII = useCallback(() => {
    setStageI(false)
    setStageII(true)
    setSecret(false)
  }, [])

  const selectSecret = useCallback(() => {
    setStageI(false)
    setStageII(false)
    setSecret(true)
  }, [])

  return (
    <Dialog onClose={onCancel} open={open}>
      <DialogTitle id="form-dialog-title">
        {t('publicObjectives.labels.add')}
      </DialogTitle>
      <DialogContent>
        <Box m={1}>
          <ButtonGroup aria-label="outlined primary button group">
            <Button
              color={stageISelected ? 'secondary' : undefined}
              onClick={selectStageI}
            >
              {t('general.labels.stageI')}
            </Button>
            <Button
              color={stageIISelected ? 'secondary' : undefined}
              onClick={selectStageII}
            >
              {t('general.labels.stageII')}
            </Button>
            <Button
              color={secretSelected ? 'secondary' : undefined}
              onClick={selectSecret}
            >
              {t('general.labels.secretObj')}
            </Button>
          </ButtonGroup>
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
