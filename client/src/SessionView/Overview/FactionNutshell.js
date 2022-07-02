import {
  Button,
  Dialog,
  Card,
  CardContent,
  CardActions,
} from '@material-ui/core'
import { LocalLibrary, PhotoLibrary } from '@material-ui/icons'

import { useTranslation } from '../../i18n'
import { getFactionCheatSheetPath } from '../../gameInfo/factions'

export function FactionNutshell({ onClose, factionKey }) {
  const { t } = useTranslation()
  const factionName = factionKey ? t(`factions.${factionKey}.name`) : ''

  return (
    <Dialog maxWidth="lg" onClose={onClose} open={factionKey !== null}>
      {factionKey && (
        <Card>
          <CardContent>
            <img
              alt={factionKey}
              src={getFactionCheatSheetPath(factionKey)}
              title={factionName}
            />
          </CardContent>
          <CardActions disableSpacing>
            <Button
              aria-label={t('sessionView.overview.goToWiki')}
              href={`https://twilight-imperium.fandom.com/wiki/${encodeURIComponent(
                factionName,
              )}`}
              startIcon={<LocalLibrary />}
              target="about:blank"
            >
              {t('sessionView.overview.goToWiki')}
            </Button>
            <Button
              aria-label={t('sessionView.overview.openOriginal')}
              href={getFactionCheatSheetPath(factionKey)}
              startIcon={<PhotoLibrary />}
              target="about:blank"
            >
              {t('sessionView.overview.openOriginal')}
            </Button>
          </CardActions>
        </Card>
      )}
    </Dialog>
  )
}
