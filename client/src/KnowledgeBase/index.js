import { useState, useCallback } from 'react'
import clsx from 'clsx'
import {
  Drawer,
  Grid,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import reverseObjective from '../assets/objective-1-reverse.jpg'

function TabPanel({ children, value, index }) {
  if (value !== index) {
    return null
  }

  return children
}

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    right: 0,
    top: 0,
    bottom: 0,
    width: 0,
    zIndex: 1199,
    transition: theme.transitions.create(['right'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  cardContainer: {
    '&:hover > *:not(:hover)': {
      opacity: .8,
      '& > img': {
        transform: 'rotate(90deg)',
      }
    },
  },
  rootActive: {
    right: ({ drawerWidth }) => drawerWidth,
    transition: theme.transitions.create(['right'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  card: {
    cursor: 'pointer',
    opacity: .8,
    marginLeft: -30,
    '& > img': {
      height: 80,
      width: 'auto',
      transform: 'rotate(90deg)',
      transition: theme.transitions.create(['transform'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    }
  },
  hoverableCard: {
    '&:hover': {
      opacity: 1,
      '& > img': {
        transform: 'translateX(-20px) scale(1.4) rotate(90deg)',
      }
    },
  },
  cardActive: {
    opacity: 1,
    '& > img': {
      transform: 'translateX(-20px) scale(1.4) rotate(90deg)',
    }
  },
  smallCard: {
    '& > img': {
      height: 64,
    }
  },
  drawer: {
    width: 0,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    border: 'none',
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  drawerOpen: {
    width: ({ drawerWidth }) => drawerWidth,
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  drawerBackdrop: {
    position: 'fixed',
    top: 0,
    width: ({ gapWidth }) => gapWidth,
    bottom: 0,
    left: 0,
  },
}))

function KnowledgeBase() {
  const smallCards = useMediaQuery('(max-width:599px)')
  const hoverable = useMediaQuery('(hover: hover)')
  const gapWidth = smallCards ? '80px' : '10%'
  const drawerWidth = `calc(100% - ${gapWidth})`
  const classes = useStyles({ gapWidth, drawerWidth })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [chosenTab, setChosenTab] = useState(0)

  const open = useCallback(index => {
    if (drawerOpen && index === chosenTab) {
      setDrawerOpen(false)
      return
    }

    if (!drawerOpen) {
      setDrawerOpen(true)
    }

    if (index !== chosenTab) {
      setChosenTab(index)
    }
  }, [chosenTab, drawerOpen])

  return <>
    <Grid
      container
      className={clsx(classes.root, {
        [classes.rootActive]: drawerOpen,
      })}
      alignItems='center'
      justifyContent='center'
      direction='column'
    >
      <span className={classes.cardContainer}>
      <div
        className={clsx(classes.card, {
          [classes.hoverableCard]: hoverable,
          [classes.smallCard]: smallCards,
          [classes.cardActive]: drawerOpen && chosenTab === 0,
        })}
      >
        <img
          onClick={() => open(0)}
          alt="Browse objectives"
          title="Browse objectives"
          src={reverseObjective}
        />
      </div>
      <div
        className={clsx(classes.card, {
          [classes.smallCard]: smallCards,
          [classes.hoverableCard]: hoverable,
          [classes.cardActive]: drawerOpen && chosenTab === 1,
        })}
      >
        <img
          onClick={() => open(1)}
          alt="Browse objectives"
          title="Browse objectives"
          src={reverseObjective}
        />
      </div>
      <div
          className={clsx(classes.card, {
            [classes.smallCard]: smallCards,
            [classes.hoverableCard]: hoverable,
            [classes.cardActive]: drawerOpen && chosenTab === 2,
          })}
      >
        <img
          onClick={() => open(2)}
          alt="Browse objectives"
          title="Browse objectives"
          src={reverseObjective}
        />
      </div>
      </span>
    </Grid>
    { drawerOpen && <div
      className={classes.drawerBackdrop}
      onClick={() => setDrawerOpen(false)}/>}
    <Drawer
      classes={{
        paper: clsx(classes.drawer, {
          [classes.drawerOpen]: drawerOpen,
        }),
      }}
      variant='permanent'
      anchor='right'
    >
      <TabPanel value={chosenTab} index={0}>
        objectives
      </TabPanel>
      <TabPanel value={chosenTab} index={1}>
        strategy cards?
      </TabPanel>
      <TabPanel value={chosenTab} index={2}>
        something else entirely
      </TabPanel>
    </Drawer>
  </>
}

export default KnowledgeBase
