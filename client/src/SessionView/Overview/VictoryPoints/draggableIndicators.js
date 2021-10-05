import { useDrag, useDrop } from 'react-dnd'
import {
  Grid,
} from '@material-ui/core'

import FactionFlag from '../../../shared/FactionFlag'

const DRAGGABLE = {
  FLAG: 'flag'
}

export function DraggableFlag({
  editable,
  factionKey,
  updatePoints,
  onClick,
}) {
  const [, drag] = useDrag(() => ({
    type: DRAGGABLE.FLAG,
    collect: monitor => ({
      isDragging: Boolean(monitor.isDragging()),
    }),
    canDrag: () => editable,
    end: (_, monitor) => {
      const result = monitor.getDropResult()

      if (result) {
        updatePoints(monitor.getDropResult().points)
      }
    },
  }), [updatePoints])

  return <FactionFlag
    disabled={!editable}
    ref={drag}
    factionKey={factionKey}
    selected
    height='25%'
    width='50%'
    onClick={onClick}
  />
}

export function PointContainer({
  className,
  children,
  points,
}) {
  const [, drop] = useDrop(() => ({
    accept: DRAGGABLE.FLAG,
    drop: () => ({ points, }),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }), [])

  return <Grid
    ref={drop}
    className={className}
    item
    container
    direction='column'
  >
    {children}
  </Grid>
}
