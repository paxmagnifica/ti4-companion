import { en as objectivesEn } from './objectives'
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
          objectives: objectivesEn,
          explorationCards,
          strategyCards,
          relics,
          general: {
            labels: {
              search: 'search',
              stageI: 'Stage I',
              stageII: 'Stage II',
              secretObj: 'Secret',
            },
            phase: {
              0: 'status phase',
              1: 'action phase',
              2: 'agenda phase'
            },
            reward: {
              0: 'victory point'
            }
          },
          sessionList: {
            title: 'Your remembered sessions',
            fullAccess: 'Full Access',
            new: 'New session',
          },
          kb: {
            title: 'Knowledge base',
            panels: {
              sI: {
                button: 'Browse stage I objectives',
                title: 'Stage I objectives',
              },
              sII: {
                button: 'Browse stage II objectives',
                title: 'Stage II objectives',
              },
              secretObj: {
                button: 'Browse secret objectives',
                title: 'Secret objectives',
              },
            }
          }
        },
      },
    },
  });

export default i18n;
