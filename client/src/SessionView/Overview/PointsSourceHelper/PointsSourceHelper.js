import { useState, useCallback } from 'react'
import { Button, Drawer } from '@material-ui/core'
import { Details as DetailsIcon } from '@material-ui/icons'

import { Trans } from '../../../i18n'

import { PointsHistory } from './PointsHistory'

export function PointsSourceHelper({ editable, factions }) {
  const [open, setOpen] = useState(false)
  const closeDrawer = useCallback(() => setOpen(false), [])
  const openDrawer = useCallback(() => setOpen(true), [])
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
        <PointsHistory
          editable={editable}
          factions={factions}
          toggleVisibility={toggleVisibility}
          visibilityState={visibilityState}
        />
      </Drawer>
    </>
  )
}
