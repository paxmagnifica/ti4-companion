import { useCallback } from 'react'
import { TextField } from '@material-ui/core'

import { ColorPicker } from '../ColorPicker'

export function MapPositions({ value, onChange }) {
  const handleMapPositionNameChange = useCallback(
    (mapPositionIndex, event) => {
      const { value: newName } = event.currentTarget

      onChange([
        ...value.slice(0, mapPositionIndex),
        { ...value[mapPositionIndex], name: newName },
        ...value.slice(mapPositionIndex + 1),
      ])
    },
    [value, onChange],
  )

  const handleMapPositionColorChange = useCallback(
    (mapPositionIndex, color) => {
      onChange([
        ...value
          .slice(0, mapPositionIndex)
          .map((oldMapPosition) =>
            oldMapPosition.color === color
              ? { name: oldMapPosition.name, color: null }
              : oldMapPosition,
          ),
        { ...value[mapPositionIndex], color },
        ...value
          .slice(mapPositionIndex + 1)
          .map((oldMapPosition) =>
            oldMapPosition.color === color
              ? { name: oldMapPosition.name, color: null }
              : oldMapPosition,
          ),
      ])
    },
    [value, onChange],
  )

  return (
    <>
      {value.map(({ name, color }, indice) => (
        <>
          <TextField
            // eslint-disable-next-line
            key={`mapPosition${indice}`}
            color="secondary"
            label={`Map position P${indice + 1}`}
            onChange={(e) => handleMapPositionNameChange(indice, e)}
            value={name || ''}
            variant="filled"
          />
          <ColorPicker
            color={color}
            onChange={(c) => handleMapPositionColorChange(indice, c)}
          />
        </>
      ))}
    </>
  )
}
