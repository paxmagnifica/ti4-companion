import { useState, useCallback } from 'react'
import clsx from 'clsx'
import { Button, Drawer, Grid, Link } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Map as MapIcon } from '@material-ui/icons'

import { Trans, useTranslation } from '../../i18n'
import useSmallViewport from '../../shared/useSmallViewport'

const useStyles = makeStyles((theme) => ({
  bigDraftSummaryMap: {
    maxWidth: '87vw',
  },
  draftSummaryGalaxy: {
    maxWidth: '47vw',
  },
  mapContainer: {
    height: '96%',
    padding: theme.spacing(1),
  },
}))

export function MapPreview({ map, mapLink, variant }) {
  const { t } = useTranslation()
  const small = useSmallViewport()
  const classes = useStyles()

  const [mapDrawerOpen, setMapDrawerOpen] = useState(false)
  const toggleMapDrawer = useCallback(
    () => setMapDrawerOpen((smdo) => !smdo),
    [],
  )

  const onlyMapLink = mapLink && !map

  return (
    <>
      {onlyMapLink && (
        <Button
          href={mapLink}
          rel="nofollow"
          startIcon={<MapIcon />}
          target="about:blank"
          variant={variant}
        >
          <Trans i18nKey="sessionTimeline.draftSummary.toggleGalaxy" />
        </Button>
      )}
      {!onlyMapLink && (
        <Button
          disabled={!map}
          onClick={toggleMapDrawer}
          startIcon={<MapIcon />}
          variant={variant}
        >
          {map && <Trans i18nKey="sessionTimeline.draftSummary.toggleGalaxy" />}
          {!map && <Trans i18nKey="sessionMap.none" />}
        </Button>
      )}
      {map && (
        <Drawer anchor="left" onClose={toggleMapDrawer} open={mapDrawerOpen}>
          <Grid
            alignItems="center"
            className={classes.mapContainer}
            container
            direction="column"
            justifyContent="center"
            style={{ gridRowGap: '2em' }}
          >
            <Grid item>
              <Link
                href={mapLink}
                rel="nofollow"
                style={{ color: 'white', lineBreak: 'anywhere' }}
                target="_blank"
              >
                {mapLink}
              </Link>
            </Grid>
            <Grid item>
              <img
                alt={t('sessionTimeline.draftSummary.galaxy')}
                className={clsx(classes.draftSummaryGalaxy, {
                  [classes.bigDraftSummaryMap]: small,
                })}
                src={map}
              />
            </Grid>
          </Grid>
        </Drawer>
      )}
    </>
  )
}
