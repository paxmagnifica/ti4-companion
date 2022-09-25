import { Fragment, useMemo } from 'react'
import {
  Grid,
  Button,
  ButtonGroup,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'

import { Trans } from '../../../i18n'
import { useObjectives } from '../../../GameComponents'
import { useSessionContext } from '../../useSessionContext'
import FactionFlag from '../../../shared/FactionFlag'
import { ObjectiveSelector } from '../../../shared/ObjectiveSelector'
import Objective from '../../../shared/Objective'
import { VP_SOURCE } from '../../../shared/constants'
import { useTimelineEvents, useAddPointSourceMutation } from '../../queries'

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
        .map(({ happenedAt, payload, eventType }) => ({
          happenedAt,
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
        ({ happenedAt, faction, points, source, context, isPublic }) => (
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
              <ListItemText>
                {'-> '}
                {points}
                {objectivesWithControls.includes(source) && (
                  <Toggle
                    defaultVisibility={!isPublic}
                    onToggle={(visible) =>
                      toggleVisibility(happenedAt, visible)
                    }
                    visible={visibilityState[happenedAt]}
                  />
                )}
              </ListItemText>
            </ListItem>
            <ListItem>
              <ButtonGroup disabled={!editable}>
                <Button
                  color={
                    source === VP_SOURCE.custodian ? 'secondary' : 'default'
                  }
                  disabled={isPublic}
                  onClick={() =>
                    addSource({
                      faction,
                      points,
                      source: VP_SOURCE.custodian,
                    })
                  }
                >
                  Custodian
                </Button>
                <Button
                  color={
                    source === VP_SOURCE.objective ? 'secondary' : 'default'
                  }
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
                >
                  Objective
                </Button>
                <Button
                  color={source === VP_SOURCE.mecatol ? 'secondary' : 'default'}
                  disabled={isPublic}
                  onClick={() =>
                    addSource({
                      faction,
                      points,
                      source: VP_SOURCE.mecatol,
                    })
                  }
                >
                  Mecatol
                </Button>
                <Button
                  color={source === VP_SOURCE.support ? 'secondary' : 'default'}
                  disabled={isPublic}
                  onClick={() =>
                    addSource({
                      faction,
                      points,
                      source: VP_SOURCE.support,
                    })
                  }
                >
                  SFT
                </Button>
              </ButtonGroup>
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
