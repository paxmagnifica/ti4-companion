import { useState } from 'react'
import { Typography, Button, Grid } from '@material-ui/core'

import { useObjectives } from '../../GameComponents'
import { useTranslation, Trans } from '../../i18n'
import FactionFlag from '../../shared/FactionFlag'

export function PointControls({
  editable,
  players,
  points,
  updatePoints,
  objectives,
}) {
  const [open, setOpen] = useState(true)
  const { t } = useTranslation()
  const { objectives: availableObjectives } = useObjectives()

  return (
    <>
      <Button
        onClick={() => setOpen((a) => !a)}
        style={{ margin: '0.6em auto' }}
      >
        {open ? 'Close points control' : 'Open points control'}
      </Button>
      {open && (
        <Grid
          alignItems="center"
          container
          justifyContent="center"
          spacing={2}
          style={{ padding: '0 3em' }}
        >
          {players.map(({ faction, color }) => {
            const factionPoints = points.find(
              ({ faction: f }) => faction === f,
            ).points

            const objectivePoints = objectives
              .filter(({ scoredBy }) => scoredBy.includes(faction))
              .map(({ slug }) => (availableObjectives[slug] || {}).points ?? 0)
              .reduce((accu, curr) => accu + curr, 0)

            return (
              <Grid item sm={3} xs={6}>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                    }}
                  >
                    <Button
                      disabled={!editable || factionPoints === objectivePoints}
                      onClick={() => updatePoints(faction, factionPoints - 1)}
                      style={{
                        minWidth: 'unset',
                        border: `0.2em ${t(
                          `general.labels.colors.${color}`,
                        )} solid`,
                        opacity: 0.7,
                      }}
                    >
                      -1
                    </Button>
                    <Typography style={{ fontSize: '0.8em' }}>
                      (
                      <Trans
                        i18nKey="vpCount"
                        values={{ points: factionPoints }}
                      />
                      )
                    </Typography>
                    <Button
                      disabled={!editable}
                      onClick={() => updatePoints(faction, factionPoints + 1)}
                      style={{
                        minWidth: 'unset',
                        border: `0.2em ${t(
                          `general.labels.colors.${color}`,
                        )} solid`,
                      }}
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
      )}
    </>
  )
}
