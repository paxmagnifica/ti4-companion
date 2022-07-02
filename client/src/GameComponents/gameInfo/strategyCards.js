import leadership from '../../assets/strat-1-leadership.png'
import diplomacy from '../../assets/strat-2-diplomacy.png'
import politics from '../../assets/strat-3-politics.png'
import construction from '../../assets/strat-4-construction.jpg'
import trade from '../../assets/strat-5-trade.png'
import warfare from '../../assets/strat-6-warfare.png'
import technology from '../../assets/strat-7-technology.png'
import imperial from '../../assets/strat-8-imperial.png'

const StrategyCard = {
  Leadership: 'leadership',
  Diplomacy: 'diplomacy',
  Politics: 'politics',
  Construction: 'construction',
  Trade: 'trade',
  Warfare: 'warfare',
  Technology: 'technology',
  Imperial: 'imperial',
}

export const images = {
  [StrategyCard.Leadership]: leadership,
  [StrategyCard.Diplomacy]: diplomacy,
  [StrategyCard.Politics]: politics,
  [StrategyCard.Construction]: construction,
  [StrategyCard.Trade]: trade,
  [StrategyCard.Warfare]: warfare,
  [StrategyCard.Technology]: technology,
  [StrategyCard.Imperial]: imperial,
}

export default StrategyCard
