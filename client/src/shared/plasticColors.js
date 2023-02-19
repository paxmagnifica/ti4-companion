import React, { useCallback, useContext, useMemo } from 'react'
import { IconButton, Tooltip } from '@material-ui/core'
import { ColorLens } from '@material-ui/icons'

import { useTranslation } from '../i18n'

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

export const colorNames = Object.fromEntries(
  Object.entries(colors).map(([name, color]) => [color, name]),
)

export const PlasticColorsProvider = ({
  plasticColors,
  hide,
  toggle,
  children,
}) => (
  <PlasticColorsContext.Provider
    value={{ hide, colors: hide ? {} : plasticColors || {}, toggle }}
  >
    {children}
  </PlasticColorsContext.Provider>
)

export const usePlasticColors = () => {
  const plasticColorsContext = useContext(PlasticColorsContext)

  const colorsWithHexValues = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(plasticColorsContext?.colors || {}).map(
          ([key, value]) => [
            key.toLowerCase(),
            { color: value, hex: colors[value] },
          ],
        ),
      ),
    [plasticColorsContext?.colors],
  )

  return useCallback(
    (factionKey) => colorsWithHexValues[factionKey.toLowerCase()],
    [colorsWithHexValues],
  )
}

export const TogglePlasticColorsButton = () => {
  const { t } = useTranslation()
  const plasticColorsContext = useContext(PlasticColorsContext)

  const onOff = plasticColorsContext?.hide
    ? t('togglePlastic.nowOff')
    : t('togglePlastic.nowOn')
  const title = `${t('togglePlastic.tooltip')} (${onOff})`

  return (
    <Tooltip placement="bottom" title={title}>
      <IconButton
        aria-label={title}
        onClick={plasticColorsContext?.toggle}
        style={{ color: 'white' }}
      >
        <ColorLens color={plasticColorsContext?.hide ? '' : 'secondary'} />
      </IconButton>
    </Tooltip>
  )
}
