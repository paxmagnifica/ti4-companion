import { useMemo, useState, useCallback } from 'react'
import { colors as plasticColors } from '../shared/plasticColors'

const MAP_POSITIONS = [
  { name: 'black', color: plasticColors.black },
  { name: 'yellow', color: plasticColors.yellow },
  { name: 'purple', color: plasticColors.purple },
  { name: 'red', color: plasticColors.red },
  { name: 'green', color: plasticColors.green },
  { name: 'blue', color: plasticColors.blue },
  { name: 'orange', color: plasticColors.orange },
  { name: 'pink', color: plasticColors.pink },
]

export function usePlayersAndMapPositions(initialPlayerCount = 6) {
  const [mapPositions, setMapPositions] = useState(
    MAP_POSITIONS.slice(0, initialPlayerCount),
  )
  const [players, setPlayers] = useState(
    [...Array(initialPlayerCount).keys()].map(
      (playerIndex) => `Player ${playerIndex + 1}`,
    ),
  )

  const handlePlayerCountChange = useCallback(
    (_, newValue) => {
      const diff = newValue - players.length
      const newPlayers =
        diff < 0
          ? players.slice(0, diff)
          : [...Array(newValue).keys()].map(
              (playerIndex) =>
                players[playerIndex] || `Player ${playerIndex + 1}`,
            )

      setPlayers(newPlayers)

      const newMapPositions =
        diff < 0
          ? mapPositions.slice(0, diff)
          : [...Array(newValue).keys()].map((playerIndex) => {
              if (mapPositions[playerIndex]) {
                return mapPositions[playerIndex]
              }

              const defaultMapPosition = MAP_POSITIONS[playerIndex]
              const colorTaken = mapPositions.some(
                (mp) => mp.color === defaultMapPosition.color,
              )
              const nameTaken = mapPositions.some(
                (mp) => mp.name === defaultMapPosition.name,
              )

              return {
                name: nameTaken
                  ? `${defaultMapPosition.name} (copy)`
                  : defaultMapPosition.name,
                color: colorTaken ? null : defaultMapPosition.color,
              }
            })
      setMapPositions(newMapPositions)
    },
    [players, mapPositions],
  )

  return useMemo(
    () => [
      [mapPositions, setMapPositions],
      [players, setPlayers],
      [players.length, handlePlayerCountChange],
    ],
    [mapPositions, players, handlePlayerCountChange],
  )
}
