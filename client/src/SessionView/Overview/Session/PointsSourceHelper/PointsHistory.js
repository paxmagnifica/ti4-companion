import { Fragment, useMemo } from 'react'
import { Grid, Button, List, ListItem, ListItemIcon } from '@material-ui/core'

import { Trans } from '../../../../i18n'
import { useObjectives } from '../../../../GameComponents'
import PlayerFlag from '../../../PlayerFlag'
import { ObjectiveSelector } from '../../../../shared/ObjectiveSelector'
import Objective from '../../../../shared/Objective'
import { VP_SOURCE } from '../../../../shared/constants'
import { PointsWithDelta } from '../../../../shared'

import { Toggle, Show } from './Toggle'

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
  addSource,
  editable,
  factions,
  pointsHistory,
  toggleVisibility,
  visibilityState,
}) {
  const { objectives } = useObjectives()
  const availableObjectives = useMemo(
    () => Object.values(objectives),
    [objectives],
  )
  const secretObjectives = useMemo(
    () => availableObjectives.filter((obj) => obj.secret),
    [availableObjectives],
  )

  return (
    <List
      style={{
        overflowY: 'auto',
        boxShadow: 'inset 0px -12px 9px -14px rgba(255, 255, 255, 1)',
        flexGrow: 1,
      }}
    >
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
