import React, { useContext, useCallback } from 'react'

export const FetchContext = React.createContext()
export const FetchProvider = ({ sessionListIdentifier, children }) => {
  const magnificentFetch = useCallback(
    (link, options, ...rest) => {
      const modifiedOptions = {
        ...options,
        headers: {
          'x-ti4companion-list-identifier': sessionListIdentifier,
          // 'x-ti4companion-session-secret': secret,
          ...options?.headers,
        },
      }

      return fetch(link, modifiedOptions, ...rest)
    },
    [sessionListIdentifier],
  )

  return (
    <FetchContext.Provider value={{ fetch: magnificentFetch }}>
      {children}
    </FetchContext.Provider>
  )
}
export const useFetch = () => useContext(FetchContext)
