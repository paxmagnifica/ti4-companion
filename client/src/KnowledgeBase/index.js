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

import stageIObjectiveReverse from '../assets/objective-1-reverse.jpg'
import stageIIObjectiveReverse from '../assets/objective-2-reverse.jpg'
import secretObjectiveReverse from '../assets/objective-secret-reverse.jpg'
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

const TABS = {
  STAGE_I_OBJ: 0,
  STAGE_II_OBJ: 1,
  SECRET_OBJ: 2,
  STRATEGY_CARDS: 3,
}

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
  const [chosenTab, setChosenTab] = useState(TABS.STAGE_I_OBJ)
  const [filters, setFilters] = useState({ stageI: true, stageII: false, secrets: false })

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
            [classes.cardActive]: drawerOpen && chosenTab === TABS.STAGE_I_OBJ,
          })}
        >
          <img
            height={80}
            onClick={() => {
              setFilters({ stageI: true })
              open(TABS.STAGE_I_OBJ)
            }}
            alt="Browse stage I objectives"
            title="Browse stage I objectives"
            src={stageIObjectiveReverse}
          />
        </div>
        <div
          className={clsx(classes.card, {
            [classes.hoverableCard]: hoverable,
            [classes.smallCard]: smallCards,
            [classes.cardActive]: drawerOpen && chosenTab === TABS.STAGE_II_OBJ,
          })}
        >
          <img
            height={80}
            onClick={() => {
              setFilters({ stageII: true })
              open(TABS.STAGE_II_OBJ)
            }}
            alt="Browse stage II objectives"
            title="Browse stage II objectives"
            src={stageIIObjectiveReverse}
          />
        </div>
        <div
          className={clsx(classes.card, {
            [classes.hoverableCard]: hoverable,
            [classes.smallCard]: smallCards,
            [classes.cardActive]: drawerOpen && chosenTab === TABS.SECRET_OBJ,
          })}
        >
          <img
            height={80}
            onClick={() => {
              setFilters({ secrets: true })
              open(TABS.SECRET_OBJ)
            }}
            alt="Browse secret objectives"
            title="Browse secret objectives"
            src={secretObjectiveReverse}
          />
        </div>
        <div
          className={clsx(classes.card, {
            [classes.hoverableCard]: hoverable,
            [classes.smallCard]: smallCards,
            [classes.cardActive]: drawerOpen && chosenTab === TABS.STRATEGY_CARDS,
          })}
        >
          <StrategyBack
            onClick={() => open(TABS.STRATEGY_CARDS)}
            alt="Browse strategy cards"
            title="Browse strategy cards"
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
        title='Stage I objectives'
        value={chosenTab}
        index={TABS.STAGE_I_OBJ}
      >
        <Objectives
          onFilterChange={setFilters}
          {...filters}
        />
      </TabPanel>
      <TabPanel
        small={smallCards}
        title='Stage II objectives'
        value={chosenTab}
        index={TABS.STAGE_II_OBJ}
      >
        <Objectives
          onFilterChange={setFilters}
          {...filters}
        />
      </TabPanel>
      <TabPanel
        small={smallCards}
        title='Secret objectives'
        value={chosenTab}
        index={TABS.SECRET_OBJ}
      >
        <Objectives
          onFilterChange={setFilters}
          {...filters}
        />
      </TabPanel>
      <TabPanel
        small={smallCards}
        title='Strategy cards'
        value={chosenTab}
        index={TABS.STRATEGY_CARDS}
      >
        <StrategyCards />
      </TabPanel>
    </Drawer>
  </>
}

export default KnowledgeBase
