import { useMemo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Flags from 'country-flag-icons/react/3x2'
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Button,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const langNames = {
  pl: 'Polski',
  en: 'English',
}

const useStyles = makeStyles({
  flag: {
    height: '1em',
  },
})

function LanguageSwitcher() {
  const classes = useStyles()
  const { t, i18n } = useTranslation()
  const [anchorEl, setAnchorEl] = useState(null)

  const flags = useMemo(
    () => ({
      pl: <Flags.PL className={classes.flag} />,
      en: <Flags.GB className={classes.flag} />,
    }),
    [classes.flag],
  )

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const changeLang = useCallback(
    (lng) => {
      i18n.changeLanguage(lng)
      setAnchorEl(null)
    },
    [i18n, setAnchorEl],
  )

  return (
    <>
      <Button onClick={handleClick} title={t('general.switchLanguage')}>
        {flags[i18n.resolvedLanguage]}
      </Button>
      <Menu
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        keepMounted
        onClose={handleClose}
        open={Boolean(anchorEl)}
      >
        <MenuItem onClick={() => changeLang('en')}>
          <ListItemIcon>{flags.en}</ListItemIcon>
          <ListItemText>{langNames.en}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => changeLang('pl')}>
          <ListItemIcon>{flags.pl}</ListItemIcon>
          <ListItemText>{langNames.pl}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

export default LanguageSwitcher
