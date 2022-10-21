import React from 'react'
import { useParams } from 'react-router-dom'
import FactionFlag from '../shared/FactionFlag'
import { useSession } from './queries'

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
  const { sessionId } = useParams()
  const { session } = useSession({
    sessionId,
  })

  const playerName = session.players.find(
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
