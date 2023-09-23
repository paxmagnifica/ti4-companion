import useMediaQuery from '@material-ui/core/useMediaQuery'

const useSmallViewport = (maxWidth = 649) => {
  const smallViewport = useMediaQuery(`(max-width:${maxWidth}px)`)

  return smallViewport
}

export default useSmallViewport
