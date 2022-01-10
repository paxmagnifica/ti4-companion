import { useTranslation } from 'react-i18next'
import { IconButton, Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Edit } from '@material-ui/icons'

import { useSessionContext } from './SessionProvider'

const useStyles = makeStyles({
  button: {
    color: 'white',
  },
})

export function EditButton() {
  const { t } = useTranslation()
  const classes = useStyles()
  const { editable } = useSessionContext()

  return (
    <Tooltip placement="bottom" title={t('edit.tooltip')}>
      <IconButton aria-label={t('edit.tooltip')} className={classes.button}>
        <Edit color={editable ? 'secondary' : ''} />
      </IconButton>
    </Tooltip>
  )
}
