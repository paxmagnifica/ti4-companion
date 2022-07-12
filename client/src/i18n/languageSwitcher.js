import { useMemo, useCallback, useState } from 'react'
import clsx from 'clsx'
import Flags from 'country-flag-icons/react/3x2'
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Button,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { useFullscreen } from '../Fullscreen'
import { useTranslation } from '.'

const langNames = {
  pl: 'Polski',
  en: 'English',
}

const useStyles = makeStyles((theme) => ({
  flag: {
    height: '1em',
  },
  switcher: {
    marginRight: 50,
  },
  fullscreen: {
    opacity: 0.5,
    marginRight: 0,
    transition: theme.transitions.create(['opacity'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    '&:hover': {
      opacity: 1,
    },
  },
}))

function LanguageSwitcher() {
  const classes = useStyles()
  const { t, i18n } = useTranslation()
  const [anchorEl, setAnchorEl] = useState(null)
  const { fullscreen } = useFullscreen()

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
      <Button
        className={clsx(classes.switcher, { [classes.fullscreen]: fullscreen })}
        onClick={handleClick}
        title={t('general.switchLanguage')}
      >
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
