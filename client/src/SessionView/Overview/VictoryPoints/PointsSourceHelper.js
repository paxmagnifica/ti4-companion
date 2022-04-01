import { useState, useCallback } from 'react'
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

export function PointsSourceHelper({ history, addSource }) {
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
          {history.map(({ faction, points, context }, index) => (
            <ListItem key={`${faction}->${points}`}>
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
                  disabled={context === VP_SOURCE.custodian}
                  onClick={() =>
                    addSource({
                      index,
                      faction,
                      points,
                      context: VP_SOURCE.custodian,
                    })
                  }
                >
                  Custodian
                </Button>
                <Button
                  disabled={context === VP_SOURCE.mecatol}
                  onClick={() =>
                    addSource({
                      index,
                      faction,
                      points,
                      context: VP_SOURCE.mecatol,
                    })
                  }
                >
                  Mecatol
                </Button>
                <Button
                  disabled={context === VP_SOURCE.support}
                  onClick={() =>
                    addSource({
                      index,
                      faction,
                      points,
                      context: VP_SOURCE.support,
                    })
                  }
                >
                  SFT
                </Button>
              </ButtonGroup>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  )
}
