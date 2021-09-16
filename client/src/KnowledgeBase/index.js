import { useState, useCallback } from 'react'
import clsx from 'clsx'
import {
  Divider,
  Drawer,
  Grid,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import reverseObjective from '../assets/objective-1-reverse.jpg'
import StrategyCard from '../gameInfo/strategyCards'

import Objectives from './Objectives'
import StrategyCards from './StrategyCards'
import StrategyBack from './StrategyBack'

const useTabPanelStyles = makeStyles({
  root: {
    padding: '2em',
    overflowX: 'hidden',
  },
})

function TabPanel({ small, children, value, index, title }) {
  const classes = useTabPanelStyles()
  if (value !== index) {
    return null
  }

  return <div className={classes.root}>
    <Typography variant="h4" component="div" gutterBottom>
      {!small && 'Knowledge base: '}<i>{title}</i>
    </Typography>
    <Divider />
    {children}
  </div>
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
      '& > *': {
        transform: 'rotate(-90deg)',
        transformOrigin: 'center center',
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
    '& > *': {
      transform: 'rotate(-90deg)',
      transformOrigin: 'center center',
      transition: theme.transitions.create(['transform'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    }
  },
  hoverableCard: {
    '&:hover': {
      opacity: 1,
      '& > *': {
        transform: 'translateX(-30%) scale(1.4) rotate(-90deg)',
        transformOrigin: 'center center',
      }
    },
  },
  cardActive: {
    opacity: 1,
    '& > *': {
      transform: 'translateX(-30%) scale(1.4) rotate(-90deg)',
      transformOrigin: 'center center',
    }
  },
  smallCard: {
    marginLeft: -22,
    '& > *': {
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
  const gapWidth = smallCards ? '70px' : '17%'
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
            height={80}
            onClick={() => open(0)}
            alt="Browse objectives"
            title="Browse objectives"
            src={reverseObjective}
          />
        </div>
        <div
          className={clsx(classes.card, {
            [classes.hoverableCard]: hoverable,
            [classes.smallCard]: smallCards,
            [classes.cardActive]: drawerOpen && chosenTab === 1,
          })}
        >
          <StrategyBack
            onClick={() => open(1)}
            alt="Browse objectives"
            title="Browse objectives"
            strategy={StrategyCard.Leadership}
            height={smallCards ? 64 : 80}
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
      <TabPanel
        small={smallCards}
        title='Objectives'
        value={chosenTab}
        index={0}
      >
        <Objectives />
      </TabPanel>
      <TabPanel
        small={smallCards}
        title='Strategy cards'
        value={chosenTab}
        index={1}
      >
        <StrategyCards />
      </TabPanel>
    </Drawer>
  </>
}

export default KnowledgeBase
