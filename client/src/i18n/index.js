import { objectives } from './objectives'
import { strategyCards } from './strategyCards'
import { explorationCards } from './explorationCards'
import { relics } from './relics'

const i18n = {
  objectivesDictionary: objectives,
  objectivesArray: Object.values(objectives),
  strategyCards,
  explorationCards,
  explorationCardsArray: Object.values(explorationCards),
  relics,
  relicsArray: Object.values(relics),
  general: {
    phase: {
      0: 'status phase',
      1: 'action phase',
      2: 'agenda phase'
    },
    reward: {
      0: 'victory point'
    }
  }
}

export default i18n
