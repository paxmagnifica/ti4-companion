import { IconButton } from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'

const shouldShow = (visible, defaultVisibility) =>
  visible === undefined ? defaultVisibility : visible

export function Show({ visible, defaultVisibility, children }) {
  const ss = shouldShow(visible, defaultVisibility)

  if (!ss) {
    return null
  }

  return children
}

export function Toggle({ visible, defaultVisibility, onToggle }) {
  const ss = shouldShow(visible, defaultVisibility)

  return (
    <IconButton onClick={() => onToggle(!ss)}>
      {ss ? <VisibilityOff /> : <Visibility />}
    </IconButton>
  )
}
