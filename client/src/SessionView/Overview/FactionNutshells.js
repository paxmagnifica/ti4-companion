import { useState } from 'react'
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
import { Link, generatePath } from 'react-router-dom'
import { LocalLibrary, PhotoLibrary, Info } from '@material-ui/icons'

import { useTranslation, Trans } from '../../i18n'
import { SESSION_VIEW_ROUTES } from '../../shared/constants'
import * as factions from '../../gameInfo/factions'

import { FactionNutshell } from './FactionNutshell'
import { DraftSummaryDialog } from './DraftSummaryDialog'

function FactionNutshells({
  players,
  classes,
  sessionId,
  showTablePosition,
  wasDrafted,
}) {
  const { t } = useTranslation()
  const [nutshellFactionKey, setFactionNutshellKey] = useState(null)

  const [draftSummaryDialogOpen, setDraftSummaryDialogOpen] = useState(false)

  return players.map(({ atTable, faction, playerName, color, speaker }) => {
    const factionData = factions.getData(faction)
    const factionName = t(`factions.${faction}.name`)

    const player = (
      <span>
        {playerName || factionName}
        {speaker && (
          <em>
            {' '}
            (<Trans i18nKey="sessionView.r1Speaker" />)
          </em>
        )}
        {showTablePosition && (
          <em>
            {' '}
            (
            <Trans
              i18nKey="sessionView.factionNutshell.tablePosition"
              values={{ position: atTable + 1 }}
            />
            )
          </em>
        )}
        {wasDrafted && (
          <Tooltip
            placement="top"
            title={t('sessionView.factionNutshell.draftDetails')}
          >
            <IconButton
              aria-label={t('sessionView.factionNutshell.draftDetails')}
              onClick={() => setDraftSummaryDialogOpen(true)}
            >
              <Info />
            </IconButton>
          </Tooltip>
        )}
      </span>
    )
    const forcedEmptyAvatarValue = ' '

    return (
      <>
        <Grid key={factionData.key} item sm={6} xs={12}>
          <Card className={classes.factionCard}>
            <CardHeader
              avatar={
                playerName || color ? (
                  <Link
                    title="go to details to change colors"
                    to={generatePath(SESSION_VIEW_ROUTES.details, {
                      sessionId,
                    })}
                  >
                    <Avatar
                      alt={player}
                      style={{
                        backgroundColor: color || 'rgba(255, 255, 255, .5)',
                      }}
                      variant="rounded"
                    >
                      {forcedEmptyAvatarValue}
                    </Avatar>
                  </Link>
                ) : (
                  <Avatar alt={player} src={factionData.image} />
                )
              }
              title={player}
            />
            <CardMedia
              className={classes.media}
              image={factions.getFactionCheatSheetPath(factionData.key)}
              onClick={() => setFactionNutshellKey(factionData.key)}
              title={factionName}
            />
            <CardActions disableSpacing>
              <Tooltip
                placement="top"
                title={t('sessionView.overview.goToWiki')}
              >
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
        <FactionNutshell
          factionKey={nutshellFactionKey}
          onClose={() => setFactionNutshellKey(null)}
        />
        <DraftSummaryDialog
          open={draftSummaryDialogOpen}
          set={setDraftSummaryDialogOpen}
        />
      </>
    )
  })
}

export default FactionNutshells
