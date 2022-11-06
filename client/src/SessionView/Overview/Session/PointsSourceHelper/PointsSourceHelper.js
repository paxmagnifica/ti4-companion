import { useState, useCallback } from 'react'
import { Button, Drawer } from '@material-ui/core'
import { Details as DetailsIcon } from '@material-ui/icons'

import { Trans } from '../../../../i18n'

import { PointsHistory } from './PointsHistory'

export function PointsSourceHelper({ editable, factions, setChatVisibility }) {
  const [open, setOpen] = useState(false)
  const closeDrawer = useCallback(() => {
    setOpen(false)
    setChatVisibility(true)
  }, [setChatVisibility])
  const openDrawer = useCallback(() => {
    setOpen(true)
    setChatVisibility(false)
  }, [setChatVisibility])
  const [visibilityState, setVisibilityState] = useState({})
  const toggleVisibility = (happenedAt, visible) =>
    setVisibilityState((s) => ({ ...s, [happenedAt]: visible }))

  return (
    <>
      <Button
        endIcon={<DetailsIcon />}
        onClick={openDrawer}
        startIcon={<DetailsIcon />}
      >
        <Trans i18nKey="sessionView.overview.vpSource" />
      </Button>
      <Drawer
        anchor="left"
        onClose={closeDrawer}
        open={open}
        style={{ maxWidth: '100%' }}
      >
        <PointsHistory
          editable={editable}
          factions={factions}
          toggleVisibility={toggleVisibility}
          visibilityState={visibilityState}
        />
        <Button
          onClick={closeDrawer}
          style={{
            position: 'sticky',
            bottom: 0,
            zIndex: 999999,
            maxWidth: '100%',
          }}
          variant="contained"
        >
          Close
        </Button>
      </Drawer>
    </>
  )
}
