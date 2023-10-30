import { useCallback, useMemo, useState, useContext } from 'react'
import { Grid, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { useTranslation } from '../../../../i18n'
import useSmallViewport from '../../../../shared/useSmallViewport'
import { ComboDispatchContext } from '../../../../state'
import Objective from '../../../../shared/Objective'
import { useFullscreen } from '../../../../Fullscreen'
import { useObjectives } from '../../../../GameComponents'

import AddObjective from './AddObjective'
import ObjectiveWithFactionSelector from './ObjectiveWithFactionSelector'

const useStyles = makeStyles({
  objectiveContainer: {
    position: 'relative',
    padding: 0,
    margin: ({ small, fullscreen }) => {
      if (small) {
        return 6
      }

      if (fullscreen) {
        return '1vw 1.4vw'
      }

      return 18
    },
    display: 'flex',
    alignItems: 'flex-start',
  },
})

function PublicObjectives({ editable, session }) {
  const { t } = useTranslation()
  const smallViewport = useSmallViewport()
  const { fullscreen } = useFullscreen()
  const classes = useStyles({ small: smallViewport, fullscreen })
  const comboDispatch = useContext(ComboDispatchContext)
  const { objectives: availableObjectives, queryInfo } = useObjectives()
  const sessionObjectives = useMemo(() => session.objectives || [], [session])
  const [addObjectiveOpen, setAddObjectiveOpen] = useState(false)

  const objectiveAdded = useCallback(
    (objective) => {
      comboDispatch({
        type: 'ObjectiveAdded',
        payload: { sessionId: session.id, slug: objective.slug },
      })
      setAddObjectiveOpen(false)
    },
    [comboDispatch, session.id],
  )

  const objectiveScored = useCallback(
    ({ change, objective }) => {
      const factionPoints = session.points.find(
        ({ faction }) => faction === change.factionKey,
      )?.points
      const objectivePoints = availableObjectives[objective.slug].points

      if (change.event === 'selected') {
        comboDispatch({
          type: 'ObjectiveScored',
          payload: {
            sessionId: session.id,
            slug: objective.slug,
            faction: change.factionKey,
            points: factionPoints + objectivePoints,
          },
        })
      } else {
        comboDispatch({
          type: 'ObjectiveDescored',
          payload: {
            sessionId: session.id,
            slug: objective.slug,
            faction: change.factionKey,
            points: factionPoints - objectivePoints,
          },
        })
      }
    },
    [comboDispatch, session.id, session.points, availableObjectives],
  )

  if (!queryInfo.isFetched) {
    return null
  }

  return (
    <>
      <Grid container justifyContent="center">
        {sessionObjectives.map((sessionObjective) => (
          <div
            key={sessionObjective.slug}
            className={classes.objectiveContainer}
          >
            <ObjectiveWithFactionSelector
              deletable={editable}
              disabled={!editable}
              objective={sessionObjective}
              selector={{
                factions: session.factions,
                value: sessionObjective.scoredBy,
                onChange: (change) =>
                  objectiveScored({ change, objective: sessionObjective }),
              }}
              session={session}
              size={
                smallViewport ? 'small' : fullscreen ? 'fullscreen' : 'default'
              }
            />
          </div>
        ))}
        {editable && (
          <div className={classes.objectiveContainer}>
            <IconButton
              onClick={() => setAddObjectiveOpen(true)}
              style={{ padding: 0, margin: 0 }}
            >
              <Objective
                reverse
                size={
                  smallViewport
                    ? 'small'
                    : fullscreen
                    ? 'fullscreen'
                    : 'default'
                }
                title={t('publicObjectives.labels.new')}
              />
            </IconButton>
          </div>
        )}
      </Grid>
      {editable && (
        <AddObjective
          availableObjectives={availableObjectives}
          onCancel={() => setAddObjectiveOpen(false)}
          onSelect={objectiveAdded}
          open={addObjectiveOpen}
        />
      )}
    </>
  )
}

export default PublicObjectives
