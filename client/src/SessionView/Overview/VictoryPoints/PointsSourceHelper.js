import { useState, useCallback, Fragment, useMemo } from 'react'
import {
  IconButton,
  Button,
  ButtonGroup,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import { Details as DetailsIcon } from '@material-ui/icons'

import FactionFlag from '../../../shared/FactionFlag'
import { ObjectiveSelector } from '../../../shared/ObjectiveSelector'
import { VP_SOURCE } from '../../../shared/constants'
import { useObjectives } from '../../../queries'
import { useSessionContext } from '../../useSessionContext'

export function PointsSourceHelper({ factions }) {
  const { pointChangesHistory: history, addPointSource: addSource } =
    useSessionContext()
  const [open, setOpen] = useState(false)
  const closeDrawer = useCallback(() => setOpen(false), [])
  const openDrawer = useCallback(() => setOpen(true), [])
  const { objectives: availableObjectives } = useObjectives()
  const secretObjectives = useMemo(
    () => Object.values(availableObjectives).filter((obj) => obj.secret),
    [availableObjectives],
  )

  return (
    <>
      {Boolean(history.length) && (
        <IconButton onClick={openDrawer}>
          <DetailsIcon />
        </IconButton>
      )}
      <Drawer
        anchor="left"
        onClose={closeDrawer}
        open={open}
        style={{ maxWidth: '100vw' }}
      >
        <Button
          onClick={closeDrawer}
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 999999,
            maxWidth: '100vw',
          }}
          variant="contained"
        >
          Close
        </Button>
        <List>
          {history.map(({ faction, points, source, context }, index) => (
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
                    color={
                      source === VP_SOURCE.mecatol ? 'secondary' : 'default'
                    }
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
                    color={
                      source === VP_SOURCE.support ? 'secondary' : 'default'
                    }
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
      </Drawer>
    </>
  )
}
