import { useCallback, useContext, useState } from 'react'
import { IconButton, Tooltip } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import { useTranslation, Trans } from 'react-i18next'

import Confirmation from './Confirmation'
import { ComboDispatchContext } from '../state'

function DeleteObjectiveButton({ className, session, objectiveSlug }) {
  const comboDispatch = useContext(ComboDispatchContext)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { t } = useTranslation()

  const handleDelete = useCallback(() => {
    comboDispatch({
      type: 'ObjectiveDeleted',
      payload: { sessionId: session.id, slug: objectiveSlug },
    })
    setShowConfirmation(false)
  }, [comboDispatch, session.id, objectiveSlug])

  const deletePo = useCallback(() => {
    const anyVpScored = session.points.some(({ points }) => points !== 0)

    if (anyVpScored) {
      setShowConfirmation(true)

      return
    }

    handleDelete()
  }, [session, handleDelete])

  return (
    <div className={className}>
      <Tooltip placement="bottom" title={t('deletePO.tooltip')}>
        <IconButton onClick={deletePo}>
          <Delete title={t('deletePO.tooltip')} />
        </IconButton>
      </Tooltip>
      <Confirmation
        cancel={() => setShowConfirmation(false)}
        confirm={handleDelete}
        open={showConfirmation}
      >
        <Trans i18nKey="deletePO.content" />
      </Confirmation>
    </div>
  )
}

export default DeleteObjectiveButton
