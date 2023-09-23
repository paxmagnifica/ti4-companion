import { makeStyles } from '@material-ui/core/styles'
import { Drawer as MUIDrawer } from '@material-ui/core'
import clsx from 'clsx'
import useSmallViewport from './useSmallViewport'

const useStyles = makeStyles(() => ({
  smallViewport: {
    maxWidth: '87vw !important',
  },
  root: {
    maxWidth: '47vw',
    height: '100%',
    overflow: 'auto',
    padding: '1em',
  },
}))

export function Drawer({ open, onClose, children }) {
  const small = useSmallViewport()
  const classes = useStyles()

  return (
    <MUIDrawer anchor="left" onClose={onClose} open={open}>
      <div
        className={clsx(classes.root, {
          [classes.smallViewport]: small,
        })}
      >
        {children}
      </div>
    </MUIDrawer>
  )
}
