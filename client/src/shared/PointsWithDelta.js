import { Typography } from '@material-ui/core'

import { Trans } from '../i18n'

export function PointsWithDelta({ from, to }) {
  const delta = to - from

  return (
    <Typography variant="h5">
      {delta > 0 ? '+' : '-'}
      <Trans i18nKey="vpCount" values={{ points: delta }} />{' '}
      <em style={{ fontSize: '0.7em', opacity: 0.8 }}>
        (<Trans i18nKey="vpCount" values={{ points: to }} />)
      </em>
    </Typography>
  )
}
