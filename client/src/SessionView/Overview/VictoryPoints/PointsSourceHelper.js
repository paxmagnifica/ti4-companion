import { useState, useCallback, Fragment } from 'react'
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
import { VP_SOURCE } from '../../../shared/constants'

export function PointsSourceHelper({ history, addSource, factions }) {
  const [open, setOpen] = useState(false)
  const closeDrawer = useCallback(() => setOpen(false), [])
  const openDrawer = useCallback(() => setOpen(true), [])

  return (
    <>
      {Boolean(history.length) && (
        <IconButton onClick={openDrawer}>
          <DetailsIcon />
        </IconButton>
      )}
      <Drawer anchor="left" onClose={closeDrawer} open={open}>
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
