import { useEffect, useCallback, useState } from 'react'
import {
  IconButton,
  Tooltip,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Fullscreen } from '@material-ui/icons';

export const useFullscreen = () => {
  const [fullscreen, setFullscreen] = useState(false)

  const handleFullscreenChange = useCallback(() => {
    setFullscreen(Boolean(document.fullscreenElement))
  }, [])
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [handleFullscreenChange])

  return fullscreen
}

const useStyles = makeStyles({
  button: {
    color: 'white',
  },
})

export const HideInFullscreen = ({ children }) => {
  const fullscreen = useFullscreen()

  if (fullscreen) {
    return null
  }

  return children
}

const FullscreenButton = () => {
  const classes = useStyles()

  const goFullscreen = useCallback(() => {
    document.documentElement.requestFullscreen()
  }, [])

  return <Tooltip title="show in fullscreen mode" placement="bottom">
    <IconButton
      className={classes.button}
      onClick={goFullscreen}
      aria-label="show in fullscreen mode"
    >
      <Fullscreen />
    </IconButton>
  </Tooltip>
}

export default FullscreenButton
