import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import { en as objectivesEn, pl as objectivesPl } from './objectives'
import { en as factionsEn } from './factions'
import { en as strategyCardsEn } from './strategyCards'
import { en as explorationCardsEn } from './explorationCards'
import { en as relicsEn } from './relics'

const factory = (options = { debug: true }) =>
  i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
      ...options,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
      resources: {
        en: {
          translation: {
            factions: factionsEn,
            objectives: objectivesEn,
            explorationCards: explorationCardsEn,
            strategyCards: strategyCardsEn,
            relics: relicsEn,
            general: {
              switchLanguage: 'Change language',
              home: 'Home',
              title: 'TI4 Companion',
              labels: {
                add: 'add',
                cancel: 'cancel',
                ok: 'ok',
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
                2: 'agenda phase',
              },
              reward: {
                0: 'victory point',
              },
              confirmation: {
                title: 'Are you sure?',
              },
            },
            sessionView: {
              nav: {
                overview: 'Overview',
                map: 'Map',
                details: 'Details',
              },
              overview: {
                goToWiki: 'go to wiki',
                openOriginal: 'open original image',
                sessionStart: 'session from {{date}} {{time}}',
              },
            },
            sessionMap: {
              map: 'TI4 map',
              none: 'no map has been uploaded yet',
              changeFile: 'Change the map file',
              dropHere: 'Drop your map here...',
              dragHere:
                "Drag 'n' drop your map file here, or click to select the map file",
              sizeHint:
                'Keep in mind that maps smaller than 800x800px are going to be small and unreadable',
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
              vpChangeConfirmation: {
                title: 'You changed the VP target',
                content:
                  'You changed the Victory Point target.\nSome people already scored, so the game is probably in progress.\nAre you sure you want to change the Victory Point target of this game?',
              },
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
              },
            },
            deletePO: {
              tooltip: 'Remove Public Objective',
              content:
                'There are already points scored, are you sure you want to delete a Public Objective?',
            },
          },
        },
        pl: {
          translation: {
            objectives: objectivesPl,
            general: {
              switchLanguage: 'Zmień język',
              home: 'Home',
              title: 'TI4 Companion',
              labels: {
                add: 'dodaj',
                cancel: 'anuluj',
                ok: 'ok',
                objective: 'cel',
                search: 'szukaj',
                stageI: 'poziom I',
                stageII: 'poziom II',
                secretObj: 'sekretny',
                save: 'zapisz',
                undo: 'cofnij',
                copy: 'kopiuj',
              },
              phase: {
                0: 'faza statusu',
                1: 'faza akcji',
                2: 'faza polityki',
              },
              reward: {
                0: 'punkt zwycięstwa',
              },
              confirmation: {
                title: 'Jesteś pewny?',
              },
            },
            sessionView: {
              nav: {
                overview: 'Podsumowanie',
                map: 'Mapa',
                details: 'Szczegóły',
              },
              overview: {
                goToWiki: 'przejdź do wiki',
                openOriginal: 'otwórz oryginalny obraz',
                sessionStart: 'sesja od {{date}} {{time}}',
              },
            },
            sessionMap: {
              map: 'mapa TI4',
              none: 'mapa nie została dodana',
              changeFile: 'Zmień plik mapy',
              dropHere: 'Przeciągnij mapę tutaj...',
              dragHere: 'Przeciągnij i upuść, lub kliknij by wybrać plik',
              sizeHint:
                'Miej na uwadze, że mapy mniejsze niż 800x800px mogą być nieczytelne',
              preview: 'podgląd',
            },
            share: {
              copied: 'Skopiowano!',
              tooltip: 'pokaż kod qr',
              allowEdit: 'zezwól na edycję',
            },
            sessionDetails: {
              name: 'Nazwa Twojej sesji',
              tts: 'TTS',
              split: 'Split',
              startDate: 'Data rozpoczęcia sesji',
              endDate: 'Data zakończenia sesji',
              duration: 'Jak długo trwała sesja? (plus minus)',
              durationUnit: 'godziny',
              detailsSavedCorrectly: 'Detale zapisane pomyślnie',
              vpChangeConfirmation: {
                title: 'Ilość punktów zwycięstwa uległa zmianie',
                content:
                  'Ilość punktów zwycięstwa uległa zmianie.\nNiektórzy gracze zdążyli już zdobyć punkty zwycięstwa, co oznacza, że gra jest w trakcie.\nCzy na pewno chcesz zmienić ilość punktów zwycięstwa?',
              },
            },
            fullscreen: {
              tooltip: 'pokaż w trybie pełnoekranowym',
            },
            shuffle: {
              tooltip: 'pomieszaj kolejność ras',
              shuffled: 'rasy pomieszane',
            },
            publicObjectives: {
              labels: {
                add: 'dodaj cel',
                new: 'nowy cel',
              },
            },
            sessionList: {
              title: 'Twoje zapamiętane sesje',
              fullAccess: 'Pełen dostęp',
              new: 'Nowa Sesja',
              secondaryTitle: '(rasy: {{factionList}})',
            },
            kb: {
              title: 'Baza wiedzy',
              panels: {
                sI: {
                  button: 'Przeglądaj cele poziomu I',
                  title: 'Cele poziomu I',
                },
                sII: {
                  button: 'Przeglądaj cele poziomu II',
                  title: 'Cele poziomu II',
                },
                secretObj: {
                  button: 'Przeglądaj sekretne cele',
                  title: 'Sekretne cele',
                },
                exploration: {
                  button: 'Przeglądaj karty eksploracji {{type}}',
                  title: 'karty eksploracji {{type}}',
                  types: {
                    cultural: 'kulturowe',
                    hazardous: 'niegościnne',
                    industrial: 'przemysłowe',
                    frontier: 'pogranicza',
                  },
                },
                relics: {
                  button: 'Przeglądaj relikty',
                  title: 'Relikty',
                },
                strategy: {
                  button: 'Przeglądaj karty strategii',
                  title: 'Karty strategii',
                },
              },
            },
            deletePO: {
              tooltip: 'Usuń cel publiczny',
              content:
                'Ten cel publiczny został spełniony przez gracza. Czy na pewno chcesz go usunąć?',
            },
          },
        },
      },
    })

export default factory
