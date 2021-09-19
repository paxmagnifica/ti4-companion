import { objectives } from './objectives'
import { strategyCards } from './strategyCards'

const i18n = {
  objectivesDictionary: objectives,
  objectivesArray: Object.values(objectives),
  strategyCards,
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
