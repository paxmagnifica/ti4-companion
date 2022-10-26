import React from 'react'
import FactionFlag from '../shared/FactionFlag'
import { useSessionContext } from './useSessionContext'

function PlayerFlag(
  {
    disabled,
    factionKey,
    selected,
    onClick,
    width,
    height,
    className,
    borderWidth,
  },
  ref,
) {
  
  const { players } = useSessionContext()

  const playerName = players.find(
    (player) => player.faction === factionKey,
  )?.playerName

  return (
    <FactionFlag
      ref={ref}
      borderWidth={borderWidth}
      className={className}
      disabled={disabled}
      factionKey={factionKey}
      height={height}
      onClick={onClick}
      playerName={playerName}
      selected={selected}
      width={width}
    />
  )
}

export default React.forwardRef(PlayerFlag)
