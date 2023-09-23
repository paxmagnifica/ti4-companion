import { useState, useCallback } from 'react'
import { Button, Grid, Link } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Map as MapIcon } from '@material-ui/icons'

import { Trans, useTranslation } from '../../i18n'
import { Drawer } from '../../shared/Drawer'

const useStyles = makeStyles(() => ({
  openButton: {
    position: ({ sticky }) => (sticky ? 'sticky' : ''),
    top: '8px',
    zIndex: 1101,
  },
}))

export function MapPreview({ map, mapLink, variant, sticky }) {
  const { t } = useTranslation()
  const classes = useStyles({ sticky: sticky && (mapLink || map) })

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
          className={classes.openButton}
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
          className={classes.openButton}
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
        <Drawer onClose={toggleMapDrawer} open={mapDrawerOpen}>
          <Grid
            alignItems="center"
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
                src={map}
                style={{ width: '100%' }}
              />
            </Grid>
            <Grid item>
              <Button
                endIcon={<MapIcon />}
                href={map}
                rel="nofollow"
                target="about:blank"
                variant={variant}
              >
                <Trans i18nKey="sessionView.overview.openOriginal" />
              </Button>
            </Grid>
          </Grid>
        </Drawer>
      )}
    </>
  )
}
