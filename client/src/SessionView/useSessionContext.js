import React, { useContext } from 'react'

export const SessionContext = React.createContext()
export const useSessionContext = () => useContext(SessionContext)
