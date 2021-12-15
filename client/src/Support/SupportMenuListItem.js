import { Link, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

import tradeGoods from '../assets/tradegoods.png'

const useStyles = makeStyles(() => ({
  support: {
    '& img': {
      width: 32,
    },
    color: 'white',
  },
}))

export function SupportMenuListItem() {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <Link className={classes.support} href={t('support.buymeacoffee')}>
      <ListItem button>
        <ListItemIcon>
          <img alt={t('general.labels.tg')} src={tradeGoods} />
        </ListItemIcon>
        <ListItemText primary={t('support.theCreator')} />
      </ListItem>
    </Link>
  )
}
