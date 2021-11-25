import { Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import { Trans } from 'react-i18next'

function ScrollToBottom(props) {
  const scrollToBottom = () => {
    const bodyEl = document.querySelector('body')
    window.scrollTo({ top: bodyEl.offsetHeight, behavior: 'smooth' })
  }

  return (
    <Button {...props} endIcon={<ArrowDownIcon />} onClick={scrollToBottom}>
      <Trans i18nKey="general.labels.toBottom" />
    </Button>
  )
}

export default withStyles({
  root: {
    position: 'fixed',
    bottom: 0,
    right: 0,
  },
})(ScrollToBottom)
