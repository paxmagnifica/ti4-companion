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

import { useTimelineEvents, useAddPointSourceMutation } from '../../../queries'
import { useObjectives } from '../../../../queries'
import { useSessionContext } from '../../../useSessionContext'
import FactionFlag from '../../../../shared/FactionFlag'
import { ObjectiveSelector } from '../../../../shared/ObjectiveSelector'
import Objective from '../../../../shared/Objective'
import { VP_SOURCE } from '../../../../shared/constants'

const pointsHistoryEvents = ['VictoryPointsUpdated', 'ObjectiveScored']

export function PointsHistory({ factions }) {
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
        .map(({ payload, eventType }) => ({
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
      {pointsHistory.map(
        ({ faction, points, source, context, isPublic }, index) => (
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
              </ListItemText>
            </ListItem>
            <ListItem>
              <ButtonGroup>
                <Button
                  color={
                    source === VP_SOURCE.custodian ? 'secondary' : 'default'
                  }
                  disabled={isPublic}
                  onClick={() =>
                    addSource({
                      index,
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
                            index,
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
                      index,
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
                      index,
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
            {source === VP_SOURCE.objective && !isPublic && (
              <ListItem>
                <ObjectiveSelector
                  objectives={secretObjectives}
                  onChange={(selectedObjective) =>
                    addSource({
                      index,
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
                    disabled={faction === factionKey}
                    factionKey={factionKey}
                    height="2em"
                    onClick={() =>
                      addSource({
                        index,
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
          </Fragment>
        ),
      )}
    </List>
  )
}
