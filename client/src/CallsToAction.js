import { Button, Grid } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

import { Trans } from './i18n'

const useStyles = makeStyles(() => ({
  cta: {
    textDecoration: 'none',
  },
}))

export function CallsToAction() {
  const classes = useStyles()

  return (
    <Grid container justifyContent="space-around" spacing={4}>
      <Grid item sm={4} xs={12}>
        <Link className={classes.cta} to="/new/factions">
          <Button color="primary" fullWidth variant="contained">
            <Trans i18nKey="sessionList.cta.set" />
          </Button>
        </Link>
      </Grid>
      <Grid item sm={4} xs={12}>
        <Link className={classes.cta} to="/new/draft">
          <Button color="secondary" fullWidth variant="contained">
            <Trans i18nKey="sessionList.cta.draft" />
          </Button>
        </Link>
      </Grid>
    </Grid>
  )
}
