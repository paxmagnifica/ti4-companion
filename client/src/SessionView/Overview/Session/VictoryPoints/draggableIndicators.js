import { useDrag, useDrop } from 'react-dnd'
import { Grid } from '@material-ui/core'

import PlayerFlag from '../../../PlayerFlag'

const DRAGGABLE = {
  FLAG: 'flag',
}

export function DraggableFlag({ editable, factionKey, updatePoints, onClick }) {
  const [, drag] = useDrag(
    () => ({
      type: DRAGGABLE.FLAG,
      collect: (monitor) => ({
        isDragging: Boolean(monitor.isDragging()),
      }),
      canDrag: () => editable,
      end: (_, monitor) => {
        const result = monitor.getDropResult()

        if (result) {
          updatePoints(monitor.getDropResult().points)
        }
      },
    }),
    [updatePoints],
  )

  return (
    <PlayerFlag
      ref={drag}
      disabled={!editable}
      factionKey={factionKey}
      height="25%"
      onClick={onClick}
      selected
      width="50%"
    />
  )
}

export function PointContainer({ className, children, points }) {
  const [, drop] = useDrop(
    () => ({
      accept: DRAGGABLE.FLAG,
      drop: () => ({ points }),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [],
  )

  return (
    <Grid ref={drop} className={className} container direction="column" item>
      {children}
    </Grid>
  )
}
