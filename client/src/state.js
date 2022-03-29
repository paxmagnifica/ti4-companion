import React, { useContext } from 'react'

export const StateContext = React.createContext()
export const ComboDispatchContext = React.createContext()
export const DispatchContext = React.createContext()

export const useComboDispatch = () => {
  const dispatch = useContext(ComboDispatchContext)

  return dispatch
}

export const init = () => ({
  relics: {
    loading: false,
    loaded: false,
    data: {},
    slugs: [],
  },
})

export const reducer = (state, action) => {
  switch (action.type) {
    case 'LoadingRelics':
      return {
        ...state,
        relics: {
          loading: true,
          loaded: false,
        },
      }
    case 'LoadRelics':
      return {
        ...state,
        relics: {
          loading: false,
          loaded: true,
          data: action.relics.reduce(
            (accu, obj) => ({ ...accu, [obj.slug]: obj }),
            {},
          ),
          slugs: action.relics.map(({ slug }) => slug),
        },
      }
    default:
      console.error('unhandled action', action)

      return state
  }
}
