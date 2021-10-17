import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { en as objectivesEn } from './objectives'
import { en as factionsEn } from './factions'
import { strategyCards } from './strategyCards'
import { explorationCards } from './explorationCards'
import { relics } from './relics'

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
          factions: factionsEn,
          objectives: objectivesEn,
          explorationCards,
          strategyCards,
          relics,
          general: {
            home: 'Home',
            title: 'TI4 Companion',
            labels: {
              add: 'add',
              cancel: 'cancel',
              objective: 'objective',
              search: 'search',
              stageI: 'stage I',
              stageII: 'stage II',
              secretObj: 'secret',
              save: 'save',
              undo: 'undo',
              copy: 'copy',
            },
            phase: {
              0: 'status phase',
              1: 'action phase',
              2: 'agenda phase'
            },
            reward: {
              0: 'victory point'
            },
          },
          sessionView: {
            overview: {
              goToWiki: 'go to wiki',
              openOriginal: 'open original image',
              sessionStart: 'session from {{date}} {{time}}'
            },
          },
          sessionMap: {
            map: 'TI4 map',
            none: 'no map has been uploaded yet',
            changeFile: 'Change the map file',
            dropHere: 'Drop your map here...',
            dragHere: 'Drag \'n\' drop your map file here, or click to select the map file',
            sizeHint: 'Keep in mind that maps smaller than 800x800px are going to be small and unreadable',
            preview: 'preview',
          },
          share: {
            copied: 'Copied!',
            tooltip: 'show qr code',
            allowEdit: 'allow edit',
          },
          sessionDetails: {
            name: 'Your session name',
            tts: 'TTS',
            split: 'Split',
            startDate: 'Session date',
            endDate: 'Session end date',
            duration: 'How long did you play? (roughly)',
            durationUnit: 'hours',
            detailsSavedCorrectly: 'Details saved correctly',
          },
          fullscreen: {
            tooltip: 'show in fullscreen mode',
          },
          shuffle: {
            tooltip: 'shuffle faction order',
            shuffled: 'Factions shuffled',
          },
          publicObjectives: {
            labels: {
              add: 'add objective',
              new: 'new objective',
            },
          },
          sessionList: {
            title: 'Your remembered sessions',
            fullAccess: 'Full Access',
            new: 'New session',
            secondaryTitle: '(factions: {{factionList}})',
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
              exploration: {
                button: 'Browse {{type}} exploration cards',
                title: '{{type}} exploration cards',
                types: {
                  cultural: 'cultural',
                  hazardous: 'hazardous',
                  industrial: 'industrial',
                  frontier: 'frontier',
                },
              },
              relics: {
                button: 'Browse relics',
                title: 'Relics',
              },
              strategy: {
                button: 'Browse Strategy Cards',
                title: 'Strategy Cards',
              },
            }
          }
        },
      },
    },
  });

export default i18n;
