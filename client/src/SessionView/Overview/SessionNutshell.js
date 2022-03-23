import { Grid } from '@material-ui/core'
import { Trans } from 'react-i18next'

import { useSessionContext } from '../useSessionContext'

export function SessionNutshell() {
  const { session } = useSessionContext()

  return (
    <Grid
      alignItems="center"
      container
      justifyContent="center"
      spacing={4}
      styles={{ color: 'white' }}
    >
      <Grid item xs={12}>
        {session.displayName && `${session.displayName}, `}
        <Trans
          i18nKey="playersCount"
          values={{
            players: session.players?.length || session.draft?.players?.length,
          }}
        />
        , <Trans i18nKey="vpCount" values={{ points: session.vpCount }} />
        {session.start && (
          <>
            {', '}
            <Trans
              i18nKey="sessionView.overview.sessionStart"
              values={{ when: session.start }}
            />
          </>
        )}
      </Grid>
    </Grid>
  )
}
