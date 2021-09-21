import { useEffect, useContext } from 'react'

import { DispatchContext, StateContext } from '../../state'
import {
  CircularProgress,
} from '@material-ui/core'

import * as explorationCardsService from './service'

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
  return <pre>
    {JSON.stringify(availableCards, null, 2)}
  </pre>
}

export default ExplorationCardsProvider
