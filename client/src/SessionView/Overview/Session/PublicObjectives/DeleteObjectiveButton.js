import { useCallback, useContext, useState } from 'react'
import { IconButton, Tooltip } from '@material-ui/core'
import { Delete } from '@material-ui/icons'

import { useTranslation, Trans } from '../../../../i18n'
import Confirmation from '../../../../shared/Confirmation'
import { ComboDispatchContext } from '../../../../state'

function DeleteObjectiveButton({ className, session, objective }) {
  const comboDispatch = useContext(ComboDispatchContext)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { t } = useTranslation()

  const handleDelete = useCallback(() => {
    comboDispatch({
      type: 'ObjectiveDeleted',
      payload: { sessionId: session.id, slug: objective.slug },
    })
    session.points.forEach((scored) => {
      if (objective.scoredBy.includes(scored.faction)) {
        comboDispatch({
          type: 'VictoryPointsUpdated',
          payload: {
            sessionId: session.id,
            faction: scored.faction,
            points: scored.points - 1,
          },
        })
      }
    })
    setShowConfirmation(false)
  }, [session, objective, comboDispatch])

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
        <IconButton onClick={deletePo} style={{ padding: 5 }}>
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
