import { Fragment, useMemo } from 'react'
import { Grid, Button, List, ListItem, ListItemIcon } from '@material-ui/core'

import { Trans } from '../../../../i18n'
import { useObjectives } from '../../../../GameComponents'
import { useSessionContext } from '../../../useSessionContext'
import PlayerFlag from '../../../PlayerFlag'
import { ObjectiveSelector } from '../../../../shared/ObjectiveSelector'
import Objective from '../../../../shared/Objective'
import { VP_SOURCE } from '../../../../shared/constants'
import { PointsWithDelta } from '../../../../shared'
import { useTimelineEvents, useAddPointSourceMutation } from '../../../queries'

import { Toggle, Show } from './Toggle'

const pointsHistoryEvents = ['VictoryPointsUpdated', 'ObjectiveScored']
const objectivesWithControls = [VP_SOURCE.objective, VP_SOURCE.support]
const pickableSources = [
  VP_SOURCE.objective,
  VP_SOURCE.custodian,
  VP_SOURCE.support,
  VP_SOURCE.emphidia,
  VP_SOURCE.shard,
  VP_SOURCE.mecatol,
  VP_SOURCE.agenda,
]

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
                <PlayerFlag
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
                {pickableSources.map((vpSource) => (
                  <Button
                    key={`vpSource_${vpSource}`}
                    color={source === vpSource ? 'secondary' : 'default'}
                    disabled={!editable}
                    onClick={() =>
                      addSource({ faction, points, source: vpSource })
                    }
                    variant="outlined"
                  >
                    <Trans
                      i18nKey={`sessionView.pointsHistory.sources.${vpSource}`}
                    />
                  </Button>
                ))}
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
                    <PlayerFlag
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
