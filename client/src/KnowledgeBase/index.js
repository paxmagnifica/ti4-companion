import { useState, useMemo, useCallback } from 'react'
import clsx from 'clsx'
import { Divider, Drawer, Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTranslation } from 'react-i18next'

import { useFullscreen } from '../Fullscreen'
import stageIObjectiveReverse from '../assets/objective-1-reverse.jpg'
import stageIIObjectiveReverse from '../assets/objective-2-reverse.jpg'
import secretObjectiveReverse from '../assets/objective-secret-reverse.jpg'
import explorationReverseSprite from '../assets/exploration-reverse-sprite.png'
import relicSprite from '../assets/relic-sprite.jpg'
import StrategyCard from '../gameInfo/strategyCards'

import Objectives from './Objectives'
import ExplorationCards from './ExplorationCards'
import Relics from './Relics'
import StrategyCards from './StrategyCards'
import StrategyBack from './StrategyBack'

const useTabPanelStyles = makeStyles({
  root: {
    padding: '2em',
    overflowX: 'hidden',
  },
  title: {
    whiteSpace: 'normal',
  },
})

const TABS = {
  STAGE_I_OBJ: 0,
  STAGE_II_OBJ: 1,
  SECRET_OBJ: 2,
  STRATEGY_CARDS: 3,
  EXPLORATION_CULTURAL: 4,
  EXPLORATION_HAZARDOUS: 5,
  EXPLORATION_BIOTIC: 6,
  EXPLORATION_FRONTIER: 7,
  RELICS: 8,
}

function TabPanel({ small, children, value, index, title }) {
  const classes = useTabPanelStyles()
  const { t } = useTranslation()

  if (value !== index) {
    return null
  }

  return (
    <div className={classes.root}>
      <Typography
        className={classes.title}
        component="div"
        gutterBottom
        variant="h4"
      >
        {!small && `${t('kb.title')}: `}
        <i>{title}</i>
      </Typography>
      <Divider />
      {children}
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
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
      opacity: 0.8,
      '& > *': {
        transform: 'rotate(-90deg)',
        transformOrigin: 'center center',
      },
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
    position: 'relative',
    cursor: 'pointer',
    opacity: 0.8,
    marginLeft: -30,
    '& > *': {
      transform: 'rotate(-90deg)',
      transformOrigin: 'center center',
      transition: theme.transitions.create(['transform'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
  },
  explorationCard: {
    backgroundImage: `url(${explorationReverseSprite})`,
    backgroundSize: 'auto 100%',
  },
  relicCard: {
    backgroundImage: `url(${relicSprite})`,
    backgroundSize: 'auto 100%',
  },
  hoverableCard: {
    '&:hover': {
      opacity: 1,
      '& > *': {
        transform: 'translateX(-30%) scale(1.4) rotate(-90deg)',
        transformOrigin: 'center center',
      },
    },
  },
  cardActive: {
    opacity: 1,
    '& > *': {
      transform: 'translateX(-30%) scale(1.4) rotate(-90deg)',
      transformOrigin: 'center center',
    },
  },
  smallCard: {
    marginLeft: -22,
    '& > *': {
      height: 64,
    },
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
  const { t } = useTranslation()
  const { fullscreen } = useFullscreen()
  const smallCards = useMediaQuery('(max-width:599px)')
  const hoverable = useMediaQuery('(hover: hover)')
  const gapWidth = smallCards ? '70px' : '17%'
  const drawerWidth = `calc(100% - ${gapWidth})`
  const classes = useStyles({ gapWidth, drawerWidth })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [chosenTab, setChosenTab] = useState(TABS.SECRET_OBJ)
  const [objectiveFilters, setObjectiveFilters] = useState({
    stageI: false,
    stageII: false,
    secrets: false,
  })
  const [explorationFilters, setExplorationFilters] = useState({
    cultural: false,
    hazardous: false,
    industrial: false,
    frontier: false,
  })

  const explorationCards = useMemo(
    () =>
      smallCards
        ? [
            {
              type: 'cultural',
              tab: TABS.EXPLORATION_CULTURAL,
              height: 64,
              width: 41.6,
              backgroundPosition: -127,
            },
            {
              type: 'hazardous',
              tab: TABS.EXPLORATION_HAZARDOUS,
              height: 64,
              width: 41.6,
              backgroundPosition: -85,
            },
            {
              type: 'industrial',
              tab: TABS.EXPLORATION_BIOTIC,
              height: 64,
              width: 41.6,
              backgroundPosition: -42,
            },
            {
              type: 'frontier',
              tab: TABS.EXPLORATION_FRONTIER,
              height: 64,
              width: 41.6,
            },
          ]
        : [
            {
              type: 'cultural',
              tab: TABS.EXPLORATION_CULTURAL,
              height: 80,
              width: 52,
              backgroundPosition: -158,
            },
            {
              type: 'hazardous',
              tab: TABS.EXPLORATION_HAZARDOUS,
              height: 80,
              width: 52,
              backgroundPosition: -106,
            },
            {
              type: 'industrial',
              tab: TABS.EXPLORATION_BIOTIC,
              height: 80,
              width: 52,
              backgroundPosition: -53,
            },
            {
              type: 'frontier',
              tab: TABS.EXPLORATION_FRONTIER,
              height: 80,
              width: 52,
            },
          ],
    [smallCards],
  )

  const open = useCallback(
    (index) => {
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
    },
    [chosenTab, drawerOpen],
  )

  if (fullscreen) {
    return null
  }

  return (
    <>
      <Grid
        alignItems="center"
        className={clsx(classes.root, {
          [classes.rootActive]: drawerOpen,
        })}
        container
        direction="column"
        justifyContent="center"
      >
        <span className={classes.cardContainer}>
          <div
            className={clsx(classes.card, {
              [classes.hoverableCard]: hoverable,
              [classes.smallCard]: smallCards,
              [classes.cardActive]:
                drawerOpen && chosenTab === TABS.STAGE_I_OBJ,
            })}
          >
            <img
              alt={t('kb.panels.sI.button')}
              height={80}
              onClick={() => {
                setObjectiveFilters({ stageI: true })
                open(TABS.STAGE_I_OBJ)
              }}
              src={stageIObjectiveReverse}
              title={t('kb.panels.sI.button')}
            />
          </div>
          <div
            className={clsx(classes.card, {
              [classes.hoverableCard]: hoverable,
              [classes.smallCard]: smallCards,
              [classes.cardActive]:
                drawerOpen && chosenTab === TABS.STAGE_II_OBJ,
            })}
          >
            <img
              alt={t('kb.panels.sII.button')}
              height={80}
              onClick={() => {
                setObjectiveFilters({ stageII: true })
                open(TABS.STAGE_II_OBJ)
              }}
              src={stageIIObjectiveReverse}
              title={t('kb.panels.sII.button')}
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
              alt={t('kb.panels.secretObj.button')}
              height={80}
              onClick={() => {
                setObjectiveFilters({ secrets: true })
                open(TABS.SECRET_OBJ)
              }}
              src={secretObjectiveReverse}
              title={t('kb.panels.secretObj.button')}
            />
          </div>
          {explorationCards.map(
            ({ type, tab, width, height, backgroundPosition }) => (
              <div
                key={type}
                className={clsx(classes.card, {
                  [classes.hoverableCard]: hoverable,
                  [classes.smallCard]: smallCards,
                  [classes.cardActive]: drawerOpen && chosenTab === tab,
                })}
              >
                <div
                  className={classes.explorationCard}
                  onClick={() => {
                    setExplorationFilters({
                      cultural: false,
                      hazardous: false,
                      industrial: false,
                      frontier: false,
                      [type]: true,
                    })
                    open(tab)
                  }}
                  style={{
                    backgroundPosition,
                    height,
                    width,
                  }}
                  title={t('kb.panels.exploration.button', {
                    type: t(`kb.panels.exploration.types.${type}`),
                  })}
                />
              </div>
            ),
          )}
          <div
            className={clsx(classes.card, {
              [classes.hoverableCard]: hoverable,
              [classes.smallCard]: smallCards,
              [classes.cardActive]: drawerOpen && chosenTab === TABS.RELICS,
            })}
          >
            <div
              alt={t('kb.panels.relics.button')}
              className={classes.relicCard}
              onClick={() => open(TABS.RELICS)}
              style={{
                backgroundPosition: '100%',
                height: smallCards ? 64 : 80,
                width: smallCards ? 41.6 : 52,
              }}
              title={t('kb.panels.relics.button')}
            />
          </div>
          <div
            className={clsx(classes.card, {
              [classes.hoverableCard]: hoverable,
              [classes.smallCard]: smallCards,
              [classes.cardActive]:
                drawerOpen && chosenTab === TABS.STRATEGY_CARDS,
            })}
          >
            <StrategyBack
              alt={t('kb.panels.strategy.button')}
              height={smallCards ? 64 : 80}
              onClick={() => open(TABS.STRATEGY_CARDS)}
              strategy={StrategyCard.Leadership}
              title={t('kb.panels.strategy.button')}
            />
          </div>
        </span>
      </Grid>
      {drawerOpen && (
        <div
          className={classes.drawerBackdrop}
          onClick={() => setDrawerOpen(false)}
        />
      )}
      <Drawer
        anchor="right"
        classes={{
          paper: clsx(classes.drawer, {
            [classes.drawerOpen]: drawerOpen,
          }),
        }}
        variant="permanent"
      >
        <TabPanel
          index={TABS.STAGE_I_OBJ}
          small={smallCards}
          title={t('kb.panels.sI.title')}
          value={chosenTab}
        >
          <Objectives
            onFilterChange={setObjectiveFilters}
            {...objectiveFilters}
          />
        </TabPanel>
        <TabPanel
          index={TABS.STAGE_II_OBJ}
          small={smallCards}
          title={t('kb.panels.sII.title')}
          value={chosenTab}
        >
          <Objectives
            onFilterChange={setObjectiveFilters}
            {...objectiveFilters}
          />
        </TabPanel>
        <TabPanel
          index={TABS.SECRET_OBJ}
          small={smallCards}
          title={t('kb.panels.secretObj.title')}
          value={chosenTab}
        >
          <Objectives
            onFilterChange={setObjectiveFilters}
            {...objectiveFilters}
          />
        </TabPanel>
        {explorationCards.map(({ type, tab }) => (
          <TabPanel
            key={`${type}-tabpanel`}
            index={tab}
            small={smallCards}
            title={`${type} exploration cards`}
            value={chosenTab}
          >
            <ExplorationCards
              onFilterChange={setExplorationFilters}
              {...explorationFilters}
            />
          </TabPanel>
        ))}
        <TabPanel
          index={TABS.RELICS}
          small={smallCards}
          title={t('kb.panels.relics.title')}
          value={chosenTab}
        >
          <Relics />
        </TabPanel>
        <TabPanel
          index={TABS.STRATEGY_CARDS}
          small={smallCards}
          title={t('kb.panels.strategy.title')}
          value={chosenTab}
        >
          <StrategyCards />
        </TabPanel>
      </Drawer>
    </>
  )
}

export default KnowledgeBase
