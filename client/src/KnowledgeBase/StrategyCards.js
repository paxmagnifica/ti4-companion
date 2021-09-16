import {
Grid
} from '@material-ui/core'

import useSmallViewport from '../shared/useSmallViewport'
import StrategyCard from '../gameInfo/strategyCards'

import StrategyFront from './StrategyFront'

function StrategyCards() {
  const smallViewport = useSmallViewport()

  return <Grid
      container
      alignItems="center"
      spacing={3}
    >
    {Object.values(StrategyCard).map(strat => <Grid
      key={strat}
      item
    >
      <StrategyFront
        strategy={strat}
        small={smallViewport}
      />
    </Grid>)}
  </Grid>
}

export default StrategyCards
