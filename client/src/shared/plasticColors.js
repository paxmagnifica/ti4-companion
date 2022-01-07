import React, { useContext, useMemo } from 'react'

const PlasticColorsContext = React.createContext()

export const colors = {
  purple: '#6f329f',
  green: '#00b050',
  yellow: '#ffff00',
  red: '#ff0000',
  black: '#020002',
  blue: '#0070c0',
  orange: '#f78507',
  pink: '#ff33cc',
}

export const PlasticColorsProvider = ({ value, children }) => (
  <PlasticColorsContext.Provider value={value || {}}>
    {children}
  </PlasticColorsContext.Provider>
)

export const usePlasticColors = () => {
  const colorKeys = useContext(PlasticColorsContext)

  const colorsWithHexValues = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(colorKeys).map(([key, value]) => [
          key,
          { color: value, hex: colors[value] },
        ]),
      ),
    [colorKeys],
  )

  return colorsWithHexValues
}
