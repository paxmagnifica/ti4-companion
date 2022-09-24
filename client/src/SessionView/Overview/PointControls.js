import { Button, Grid } from '@material-ui/core'

import { useTranslation, Trans } from '../../i18n'
import { useFactionData } from '../../GameComponents'
import FactionFlag from '../../shared/FactionFlag'

export function PointControls({ editable, players, points, updatePoints }) {
  const { t } = useTranslation()
  const { getData: getFactionData } = useFactionData()

  return (
    <Grid
      alignItems="center"
      container
      justifyContent="center"
      spacing={2}
      style={{ padding: '0 3em' }}
    >
      {players.map(({ atTable, faction, playerName, color, speaker }) => {
        const factionData = getFactionData(faction)
        const factionName = t(`factions.${faction}.name`)

        const factionPoints = points.find(
          ({ faction: f }) => faction === f,
        ).points

        return (
          <Grid item sm={3} xs={6}>
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Button
                  disabled={!editable || factionPoints === 0}
                  onClick={() => updatePoints(faction, factionPoints - 1)}
                  style={{ minWidth: 'unset' }}
                >
                  -1
                </Button>
                (
                <Trans i18nKey="vpCount" values={{ points: factionPoints }} />)
                <Button
                  disabled={!editable}
                  onClick={() => updatePoints(faction, factionPoints + 1)}
                  style={{ minWidth: 'unset' }}
                >
                  +1
                </Button>
              </div>
              <FactionFlag
                borderWidth="0.45em"
                disabled={!editable}
                factionKey={faction}
                height="10vh"
                selected
              />
            </div>
          </Grid>
        )
      })}
    </Grid>
  )
}
