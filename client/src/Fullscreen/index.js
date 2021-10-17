import { useEffect, useCallback, useState } from 'react'
import {
  IconButton,
  Tooltip,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Fullscreen } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'

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

    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
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

const FullscreenButton = () => {
  const classes = useStyles()
  const { t } = useTranslation()

  const goFullscreen = useCallback(async () => {
    document.documentElement.requestFullscreen()

    document.ti4CompanionWakeLock = await navigator.wakeLock.request('screen')
  }, [])

  return <Tooltip title={t('fullscreen.tooltip')} placement="bottom">
    <IconButton
      className={classes.button}
      onClick={goFullscreen}
      aria-label={t('fullscreen.tooltip')}
    >
      <Fullscreen />
    </IconButton>
  </Tooltip>
}

export default FullscreenButton
