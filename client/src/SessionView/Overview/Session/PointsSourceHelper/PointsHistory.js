import { Fragment, useMemo } from 'react'
import { Grid, Button, List, ListItem, ListItemIcon } from '@material-ui/core'

import { Trans } from '../../../../i18n'
import { useObjectives } from '../../../../GameComponents'
import { useSessionContext } from '../../../useSessionContext'
import FactionFlag from '../../../../shared/FactionFlag'
import { ObjectiveSelector } from '../../../../shared/ObjectiveSelector'
import Objective from '../../../../shared/Objective'
import { VP_SOURCE } from '../../../../shared/constants'
import { PointsWithDelta } from '../../../../shared'
import { useTimelineEvents, useAddPointSourceMutation } from '../../../queries'

import { Toggle, Show } from './Toggle'

const pointsHistoryEvents = ['VictoryPointsUpdated', 'ObjectiveScored']
const objectivesWithControls = [VP_SOURCE.objective, VP_SOURCE.support]

export function PointsHistory({
  editable,
  factions,
  visibilityState,
  toggleVisibility,
}) {
  const {
    session: { id: sessionId },
  } = useSessionContext()
  const { timeline } = useTimelineEvents({
    sessionId,
  })
  const { objectives } = useObjectives()
  const availableObjectives = useMemo(
    () => Object.values(objectives),
    [objectives],
  )
  const secretObjectives = useMemo(
    () => availableObjectives.filter((obj) => obj.secret),
    [availableObjectives],
  )

  const pointsHistory = useMemo(
    () =>
      timeline
        .filter(({ eventType }) => pointsHistoryEvents.includes(eventType))
        .map(({ happenedAt, payload, fromPoints, eventType }) => ({
          happenedAt,
          fromPoints,
          context: payload.slug, // public objectives have slug instead of context
          ...payload,
          source:
            VP_SOURCE.fromBackendToFrontend(payload.source) ||
            (eventType === 'ObjectiveScored' && VP_SOURCE.objective),
          isPublic: eventType === 'ObjectiveScored',
        })),
    [timeline],
  )
  const { mutate: addSource } = useAddPointSourceMutation({ sessionId })

  return (
    <List>
      {!pointsHistory.length && (
        <p style={{ margin: '1em' }}>
          <Trans i18nKey="sessionView.pointsHistory.empty" />
        </p>
      )}
      {pointsHistory.map(
        ({
          happenedAt,
          faction,
          points,
          fromPoints,
          source,
          context,
          isPublic,
        }) => (
          <Fragment key={`${faction}->${points}`}>
            <ListItem>
              <ListItemIcon>
                <FactionFlag
                  disabled
                  factionKey={faction}
                  height="2em"
                  selected
                  width="3em"
                />
              </ListItemIcon>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <PointsWithDelta from={fromPoints} to={points} />
                {objectivesWithControls.includes(source) && (
                  <Toggle
                    defaultVisibility={!isPublic}
                    onToggle={(visible) =>
                      toggleVisibility(happenedAt, visible)
                    }
                    visible={visibilityState[happenedAt]}
                  />
                )}
              </div>
            </ListItem>
            <ListItem>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gridGap: '0.5em',
                  maxWidth: '30vw',
                }}
              >
                <Button
                  color={
                    source === VP_SOURCE.custodian ? 'secondary' : 'default'
                  }
                  disabled={!editable || isPublic}
                  onClick={() =>
                    addSource({
                      faction,
                      points,
                      source: VP_SOURCE.custodian,
                    })
                  }
                  variant="outlined"
                >
                  Custodian
                </Button>
                <Button
                  color={
                    source === VP_SOURCE.objective ? 'secondary' : 'default'
                  }
                  disabled={!editable || isPublic}
                  onClick={
                    isPublic
                      ? () => null
                      : () =>
                          addSource({
                            faction,
                            points,
                            source: VP_SOURCE.objective,
                          })
                  }
                  variant="outlined"
                >
                  Objective
                </Button>
                <Button
                  color={source === VP_SOURCE.mecatol ? 'secondary' : 'default'}
                  disabled={!editable || isPublic}
                  onClick={() =>
                    addSource({
                      faction,
                      points,
                      source: VP_SOURCE.mecatol,
                    })
                  }
                  variant="outlined"
                >
                  Mecatol
                </Button>
                <Button
                  color={source === VP_SOURCE.support ? 'secondary' : 'default'}
                  disabled={!editable || isPublic}
                  onClick={() =>
                    addSource({
                      faction,
                      points,
                      source: VP_SOURCE.support,
                    })
                  }
                  variant="outlined"
                >
                  SFT
                </Button>
                <Button
                  color={
                    source === VP_SOURCE.emphidia ? 'secondary' : 'default'
                  }
                  disabled={!editable || isPublic}
                  onClick={() =>
                    addSource({
                      faction,
                      points,
                      source: VP_SOURCE.emphidia,
                    })
                  }
                  variant="outlined"
                >
                  Crown of Emphidia
                </Button>
                <Button
                  color={source === VP_SOURCE.shard ? 'secondary' : 'default'}
                  disabled={!editable || isPublic}
                  onClick={() =>
                    addSource({
                      faction,
                      points,
                      source: VP_SOURCE.shard,
                    })
                  }
                  variant="outlined"
                >
                  Shard of The Throne
                </Button>
              </div>
            </ListItem>
            <Show
              defaultVisibility={!isPublic}
              visible={visibilityState[happenedAt]}
            >
              {source === VP_SOURCE.objective && !isPublic && (
                <ListItem>
                  <ObjectiveSelector
                    disabled={!editable}
                    objectives={secretObjectives}
                    onChange={(selectedObjective) =>
                      addSource({
                        faction,
                        points,
                        source: VP_SOURCE.objective,
                        context: selectedObjective.slug,
                      })
                    }
                    value={secretObjectives.find((o) => o.slug === context)}
                  />
                </ListItem>
              )}
              {source === VP_SOURCE.objective && isPublic && (
                <ListItem>
                  <Grid container justifyContent="center">
                    <Objective
                      {...availableObjectives.find((o) => o.slug === context)}
                    />
                  </Grid>
                </ListItem>
              )}
              {source === VP_SOURCE.support && (
                <ListItem>
                  {factions.map((factionKey) => (
                    <FactionFlag
                      key={factionKey}
                      disabled={!editable || faction === factionKey}
                      factionKey={factionKey}
                      height="2em"
                      onClick={() =>
                        addSource({
                          faction,
                          points,
                          source: VP_SOURCE.support,
                          context: factionKey,
                        })
                      }
                      selected={factionKey === context}
                      width="2.5em"
                    />
                  ))}
                </ListItem>
              )}
            </Show>
          </Fragment>
        ),
      )}
    </List>
  )
}
