import { Fragment, useMemo } from 'react'
import {
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
import { VP_SOURCE } from '../../../../shared/constants'

const pointsHistoryEvents = ['VictoryPointsUpdated']

export function PointsHistory({ factions }) {
  const {
    session: { id: sessionId },
  } = useSessionContext()
  const { timeline } = useTimelineEvents({
    sessionId,
  })
  const { objectives: availableObjectives } = useObjectives()
  const secretObjectives = useMemo(
    () => Object.values(availableObjectives).filter((obj) => obj.secret),
    [availableObjectives],
  )

  const pointsHistory = useMemo(
    () =>
      timeline
        .filter(({ eventType }) => pointsHistoryEvents.includes(eventType))
        .map(({ payload }) => ({
          ...payload,
          source: VP_SOURCE.fromBackendToFrontend(payload.source),
        })),
    [timeline],
  )
  const { mutate: addSource } = useAddPointSourceMutation({ sessionId })

  return (
    <List>
      {pointsHistory.map(({ faction, points, source, context }, index) => (
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
                color={source === VP_SOURCE.custodian ? 'secondary' : 'default'}
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
                color={source === VP_SOURCE.objective ? 'secondary' : 'default'}
                onClick={() =>
                  addSource({
                    index,
                    faction,
                    points,
                    source: VP_SOURCE.objective,
                  })
                }
              >
                Secret
              </Button>
              <Button
                color={source === VP_SOURCE.mecatol ? 'secondary' : 'default'}
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
          {source === VP_SOURCE.objective && (
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
      ))}
    </List>
  )
}
