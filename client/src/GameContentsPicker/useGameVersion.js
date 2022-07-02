import React, { useState, useMemo, useContext } from 'react'

import { DEFAULT_VERSION } from './GameContentsPicker'

const GameVersionContext = React.createContext()

export const GameVersionProvider = ({ children }) => {
  const [gv, setGv] = useState(DEFAULT_VERSION)
  const v = useMemo(() => ({ gameVersion: gv, setGameVersion: setGv }), [gv])

  return (
    <GameVersionContext.Provider value={v}>
      {children}
    </GameVersionContext.Provider>
  )
}

export const useGameVersion = () => useContext(GameVersionContext)
