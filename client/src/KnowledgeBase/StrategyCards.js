import { Grid } from '@material-ui/core'

import useSmallViewport from '../shared/useSmallViewport'
import StrategyCard from '../GameComponents/gameInfo/strategyCards'

import StrategyFront from './StrategyFront'

function StrategyCards() {
  const smallViewport = useSmallViewport()

  return (
    <Grid alignItems="center" container spacing={3}>
      {Object.values(StrategyCard).map((strat) => (
        <Grid key={strat} item>
          <StrategyFront small={smallViewport} strategy={strat} />
        </Grid>
      ))}
    </Grid>
  )
}

export default StrategyCards
