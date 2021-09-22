import { useEffect, useContext } from 'react'
import {
  Grid,
  CircularProgress,
} from '@material-ui/core'

import { DispatchContext, StateContext } from '../../state'
import useSmallViewport from '../../shared/useSmallViewport'

import * as explorationCardsService from './service'
import ExplorationCard from './ExplorationCard'

function ExplorationCardsProvider(props) {
  const { explorationCards: { loading, loaded, data: availableCards }} = useContext(StateContext)
  const dispatch = useContext(DispatchContext)

  useEffect(() => {
    if (loading || loaded) {
      return
    }

    const get = async () => {
      dispatch({ type: 'LoadingExplorationCards' })
      const cards = await explorationCardsService.getAll()

      dispatch({ type: 'LoadExplorationCards', explorationCards: cards })
    }

    get()
  }, [loaded, loading, dispatch])

  if (!loaded) {
    return null
  }

  if (loading) {
    <CircularProgress color='secondary' />
  }

  return <ExplorationCards availableCards={availableCards} {...props} />
}

function ExplorationCards({
  availableCards,
  onFilterChange,
  cultural,
  warfare,
  biotic,
  frontier,
}) {
  const smallViewport = useSmallViewport()

  return <Grid container spacing={2}>
    {Object.values(availableCards).map(card => <Grid item key={card.slug}>
      <ExplorationCard {...card} small={smallViewport} />
    </Grid>)}
  </Grid>
}

export default ExplorationCardsProvider
