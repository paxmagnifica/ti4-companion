import {
  Avatar,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Grid,
  IconButton,
  Tooltip,
} from '@material-ui/core'
import { LocalLibrary, PhotoLibrary } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'

import * as factions from '../../gameInfo/factions'

function FactionNutshells({
  factionsList,
  classes,
  setFaction,
  setFactionDialogOpen,
}) {
  const { t } = useTranslation()

  return factionsList.map((faction) => {
    const factionData = factions.getData(faction)
    const factionName = t(`factions.${faction}.name`)

    return (
      <Grid key={factionData.key} item sm={6} xs={12}>
        <Card className={classes.factionCard}>
          <CardHeader
            avatar={<Avatar alt={factionName} src={factionData.image} />}
            title={factionName}
          />
          <CardMedia
            className={classes.media}
            image={factions.getFactionCheatSheetPath(factionData.key)}
            onClick={() => {
              setFaction(factionData.key)
              setFactionDialogOpen((open) => !open)
            }}
            title={factionName}
          />
          <CardActions disableSpacing>
            <Tooltip placement="top" title={t('sessionView.overview.goToWiki')}>
              <IconButton
                aria-label={t('sessionView.overview.goToWiki')}
                className={classes.factionCardIcon}
                href={`https://twilight-imperium.fandom.com/wiki/${encodeURIComponent(
                  factionName,
                )}`}
                target="about:blank"
              >
                <LocalLibrary />
              </IconButton>
            </Tooltip>
            <Tooltip
              placement="top"
              title={t('sessionView.overview.openOriginal')}
            >
              <IconButton
                aria-label={t('sessionView.overview.openOriginal')}
                className={classes.factionCardIcon}
                href={factions.getFactionCheatSheetPath(factionData.key)}
                target="about:blank"
              >
                <PhotoLibrary />
              </IconButton>
            </Tooltip>
          </CardActions>
        </Card>
      </Grid>
    )
  })
}

export default FactionNutshells
