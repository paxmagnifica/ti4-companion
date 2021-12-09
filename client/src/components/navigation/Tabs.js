import { Tab as MuiTab, Tabs as MuiTabs } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

export const Tabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 70,
      width: '100%',
      backgroundColor: '#fff',
    },
  },
})((props) => <MuiTabs {...props} TabIndicatorProps={{ children: <span /> }} />)

export const Tab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: '#fff',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    minHeight: 'unset',
    marginRight: theme.spacing(1),
    '&:focus': {
      opacity: 1,
    },
  },
  wrapper: {
    flexDirection: 'row',
  },
}))((props) => <MuiTab disableRipple {...props} />)
