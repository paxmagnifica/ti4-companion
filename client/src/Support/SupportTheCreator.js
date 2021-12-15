import { makeStyles } from '@material-ui/core/styles'
import { Grid, Link } from '@material-ui/core'
import { Trans, useTranslation } from 'react-i18next'

import tradeGoods from '../assets/tradegoods.png'
import useSmallViewport from '../shared/useSmallViewport'

const useStyles = makeStyles((theme) => ({
  root: {
    width: 'auto !important',
    marginRight: theme.spacing(1),
    color: 'white',
    '&:hover': {
      fontStyle: 'italic',
      '& img': {
        transform: 'skew(-10deg)',
      },
    },
  },
  tg: {
    height: '3vh',
    width: 'auto',
    marginLeft: 3,
  },
}))
export function SupportTheCreator() {
  const classes = useStyles()
  const { t } = useTranslation()
  const small = useSmallViewport()

  if (small) {
    return null
  }

  return (
    <Link href={t('support.buymeacoffee')} rel="nofollow" target="about:blank">
      <Grid
        alignItems="center"
        className={classes.root}
        container
        justifyContent="flex-end"
      >
        <Grid>
          <Trans i18nKey="support.theCreator" />
        </Grid>
        <img
          alt={t('general.labels.tg')}
          className={classes.tg}
          src={tradeGoods}
        />
      </Grid>
    </Link>
  )
}
