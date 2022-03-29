import React, { useContext } from 'react'

export const ComboDispatchContext = React.createContext()

export const useComboDispatch = () => {
  const dispatch = useContext(ComboDispatchContext)

  return dispatch
}
