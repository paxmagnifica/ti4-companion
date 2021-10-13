import { objectives } from './objectives'
import { strategyCards } from './strategyCards'
import { explorationCards } from './explorationCards'
import { relics } from './relics'

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          objectives,
          explorationCards,
          relics,
          general: {
            sessionList: {
              title: 'Your remembered sessions',
              fullAccess: 'Full Access',
              new: 'New session',
            },
          },
        },
      },
    },
  });

export default i18n;

// const i18n = {
  // objectivesDictionary: objectives,
  // objectivesArray: Object.values(objectives),
  // strategyCards,
  // explorationCards,
  // explorationCardsArray: Object.values(explorationCards),
  // relics,
  // relicsArray: Object.values(relics),
  // general: {
    // phase: {
      // 0: 'status phase',
      // 1: 'action phase',
      // 2: 'agenda phase'
    // },
    // reward: {
      // 0: 'victory point'
    // }
  // }
// }

// export default i18n
