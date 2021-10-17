import StrategyCard from '../gameInfo/strategyCards'

export const en = {
  [StrategyCard.Leadership]: {
    primary: 'Gain 3 command tokens.\nSpend any amount of influence to gain 1 command token for every 3 influence spent',
    secondary: 'Spend any amount of influence to gain 1 command token for every 3 influence spent',
  },
  [StrategyCard.Diplomacy]: {
    primary: 'Choose 1 system other than the Mecatol Rex system that contains a planet you control; each other player places a command token from their reinforcements in the chosen system. Then, ready up to 2 exhausted planets you control.',
    secondary: 'Spend 1 token from your strategy pool to ready up to 2 exhausted planets you control.',
  },
  [StrategyCard.Politics]: {
    primary: 'Choose a player other than the speaker. That player gains the speaker token.\nDraw 2 action cards.\nLook at the top 2 cards of the agenda deck. Place each card on the top or bottom of the deck in any order',
    secondary: 'Spend 1 token from your strategy pool to draw 2 action cards.'
  },
  [StrategyCard.Construction]: {
    primary: 'Place 1 PDS or 1 Space Dock on a planet you control.\nPlace 1 PDS on a planet you control.',
    secondary: 'Spend 1 token from your strategy pool and place it in any system; you may place either 1 space dock or 1 PDS on a planet you control in that system',
  },
  [StrategyCard.Trade]: {
    primary: 'Gain 3 trade goods.\nReplenish commodities.\nChoose any number of other players. Those players use the secondary ability of this strategy card without spending a command token.',
    secondary: 'Spend 1 token from your strategy pool to replenish your commodities.',
  },
  [StrategyCard.Warfare]: {
    primary: 'Remove 1 of your command tokens from the game board; then, gain 1 command token.\nRedistribute any number of the command tokens on your command sheet',
    secondary: 'Spend 1 token from your strategy pool to use the Production ability of 1 of your space docks in your home system (This token is not placed in your home system)',
  },
  [StrategyCard.Technology]: {
    primary: 'Research 1 technology.\nSpend 6 resources to research 1 technology.',
    secondary: 'Spend 1 token from your strategy pool and 4 resources to research 1 technology.',
  },
  [StrategyCard.Imperial]: {
    primary: 'Immediately score 1 public objective if you fulfill its requirements.\nGain 1 victory point if you control Mecatol Rex; otherwise, draw 1 secret objective',
    secondary: 'Spend 1 token from your strategy pool to draw 1 secret objective.',
  },
}
