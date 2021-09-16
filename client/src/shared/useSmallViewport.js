import useMediaQuery from '@material-ui/core/useMediaQuery'

const useSmallViewport = () => {
  const smallViewport = useMediaQuery('(max-width:649px)')

  return smallViewport
}

export default useSmallViewport
