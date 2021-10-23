import { useEffect, useCallback, useState, useRef } from 'react'
import { IconButton, Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Fullscreen } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'

import config from '../config'

export const useFullscreen = () => {
  const [fullscreen, setFullscreen] = useState(false)

  const handleFullscreenChange = useCallback(async () => {
    const isFullscreen = Boolean(document.fullscreenElement)
    setFullscreen(isFullscreen)

    if (!isFullscreen && document.ti4CompanionWakeLock) {
      await document.ti4CompanionWakeLock.release()
      document.ti4CompanionWakeLock = null
    }
  }, [])
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [handleFullscreenChange])

  const exitFullscreen = useCallback(() => {
    if (!fullscreen) {
      return
    }

    document.exitFullscreen()
  }, [fullscreen])

  return { fullscreen, exitFullscreen }
}

const useStyles = makeStyles({
  button: {
    color: 'white',
  },
})

export const HideInFullscreen = ({ children }) => {
  const { fullscreen } = useFullscreen()

  if (fullscreen) {
    return null
  }

  return children
}

const FullscreenButton = ({ service }) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const pingInterval = useRef(null)

  const goFullscreen = useCallback(async () => {
    document.documentElement.requestFullscreen()

    document.ti4CompanionWakeLock = await navigator.wakeLock.request('screen')
    service.ping()
    pingInterval.current = setInterval(
      service.ping,
      config.wakeLockPingInterval,
    )
    document.ti4CompanionWakeLock.onrelease = () => {
      clearInterval(pingInterval.current)
    }
  }, [service.ping])

  return (
    <Tooltip placement="bottom" title={t('fullscreen.tooltip')}>
      <IconButton
        aria-label={t('fullscreen.tooltip')}
        className={classes.button}
        onClick={goFullscreen}
      >
        <Fullscreen />
      </IconButton>
    </Tooltip>
  )
}

export default FullscreenButton
