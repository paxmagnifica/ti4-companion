import { useCallback, useMemo } from 'react'
import i18n from 'i18next'
import {
  initReactI18next,
  useTranslation as i18NextUseTranslation,
  Trans as I18NextTrans,
} from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// SPECIFICALLY importing from ../GameComponents/useGameVersion to avoid circular dependency with ../GameComponents
import { useGameVersion } from '../GameComponents/useGameVersion'
import { VP_SOURCE } from '../shared/constants'

import objectivesI18n from './objectives'
import explorationI18n from './explorationCards'
import { en as factionsEn } from './factions'
import { en as strategyCardsEn } from './strategyCards'
import { en as relicsEn } from './relics'
import { en as agendasEn } from './agendas'

const translationNamespaces = ['translation', 'pok', 'codex2', 'codex3']
const getTranslationNamespace = (gameVersion) =>
  translationNamespaces.slice(0, gameVersion + 1).reverse()
export const useTranslation = () => {
  const { t, ...otherI18n } = i18NextUseTranslation()
  const { gameVersion } = useGameVersion()

  const ns = useMemo(() => getTranslationNamespace(gameVersion), [gameVersion])

  const componentT = useCallback(
    (thing, options) => {
      const val = t(thing, {
        ...options,
        ns,
      })

      return val
    },
    [t, ns],
  )

  return { t: componentT, ...otherI18n }
}

export const Trans = (props) => {
  const { gameVersion } = useGameVersion()
  const ns = useMemo(() => getTranslationNamespace(gameVersion), [gameVersion])

  return <I18NextTrans {...props} ns={ns} />
}

export const factory = (options = { debug: true }) =>
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
      ns: ['codex3', 'translation'],
      defaultNS: 'translation',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
      resources: {
        en: {
          codex3: {
            objectives: objectivesI18n.en.codex3,
            explorationCards: explorationI18n.en.codex3,
          },
          translation: {
            factions: factionsEn,
            objectives: objectivesI18n.en.translation,
            explorationCards: explorationI18n.en.translation,
            strategyCards: strategyCardsEn,
            relics: relicsEn,
            agendas: agendasEn,
            vpCount: '{{points}} VP',
            playersCount: '{{players}} players',
            editProtection: {
              passwordDialog: {
                title: 'Protect editing with password',
                purpose:
                  'Your players will need this password to edit the session',
                reminder:
                  'Remember this password and share it with people who need edit privileges',
                noPassword: 'do not set password',
                setPassword: 'set password',
              },
              enableEdit: {
                tooltip: 'Enable edit',
                cancelEdit: {
                  title: 'Disable editing',
                  prompt: 'Are you sure you want to cancel edit?',
                  tooltip: 'Disable editing',
                },
                secured: {
                  title: 'Password protected',
                  prompt: 'Password given by game owner:',
                },
                title: 'Enable edit',
                toMakeChanges: 'To make changes you have to',
                prompt:
                  'This session is open for editing to anybody. Are you sure you want to proceed and edit?',
                action: 'Enable edit',
              },
            },
            errors: {
              401: 'Unauthorized',
              404: 'The item you are looking for was not found',
              500: 'Something went wrong on our side, try again in a moment',
            },
            components: {
              agenda: {
                resultTitle: {
                  0: 'Voted {{voteResult}}',
                  1: 'Voted {{voteResult}}',
                  2: 'Elected {{election}}',
                },
                voteResult: {
                  0: 'For',
                  1: 'Against',
                  2: 'Elected',
                },
              },
            },
            support: {
              theCreator: 'Support the creator',
              buymeacoffee: 'https://buymeacoffee.com/paxmagnifica',
              donate: 'donate some trade goods',
              doYouLike: 'Do you like the app?',
              consider: 'Consider supporting the creator',
            },
            general: {
              releaseNotes: 'Change log',
              paxmagnifica: 'Pax Magnifica Bellum Gloriosum',
              switchLanguage: 'Change language',
              home: 'Home',
              title: 'TI4 Companion',
              comingSoon: 'coming soon',
              from: 'from',
              edit: 'Edit',
              labels: {
                tg: 'trade goods',
                player: 'player',
                speaker: 'speaker',
                faction: 'faction',
                tablePosition: 'table position',
                toBottom: 'to bottom',
                add: 'add',
                cancel: 'cancel',
                ok: 'ok',
                upload: 'upload',
                preview: 'preview',
                objective: 'objective',
                search: 'search',
                stageI: 'stage I',
                stageII: 'stage II',
                secretObj: 'secret',
                save: 'save',
                optional: '(optional)',
                undo: 'undo',
                copy: 'copy',
                colors: {
                  purple: 'purple',
                  green: 'green',
                  yellow: 'yellow',
                  red: 'red',
                  black: 'black',
                  blue: 'blue',
                  orange: 'orange',
                  pink: 'pink',
                },
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
            sessionSetup: {
              tabs: {
                simple: 'Select factions',
                draft: 'Draft factions',
              },
              simple: {
                title: 'What factions are in the game?',
              },
            },
            drafting: {
              startCta: 'Start drafting',
              banCta: 'ban',
              pickCta: 'pick',
              speakerOrder: {
                bans: {
                  title: 'Ban order',
                },
                picks: {
                  title: 'Pick order',
                },
              },
            },
            sessionView: {
              pointsHistory: {
                empty:
                  'When you add points to anyone, you can assign its source here',
                emptyWithFilter: 'Nothing for selected faction',
                sources: {
                  [VP_SOURCE.other]: 'Other',
                  [VP_SOURCE.objective]: 'Objective',
                  [VP_SOURCE.custodian]: 'Custodian',
                  [VP_SOURCE.support]: 'SFT',
                  [VP_SOURCE.emphidia]: 'Crown of emphidia',
                  [VP_SOURCE.shard]: 'Shard of the Throne',
                  [VP_SOURCE.mecatol]: 'Mecatol',
                  [VP_SOURCE.agenda]: 'Agenda',
                },
              },
              r1Speaker: 'R1 speaker',
              factionNutshell: {
                tablePosition: 'at table: {{position}}',
                draftDetails: 'draft details',
              },
              lock: 'Prevent further editing',
              locked: 'Locked for editing',
              nav: {
                overview: 'Overview',
                galaxy: 'Galaxy',
                details: 'Details',
                timeline: 'Timeline',
              },
              overview: {
                goToWiki: 'go to wiki',
                openOriginal: 'open original image',
                sessionStart: 'session date: {{when}}',
                vpSource: 'Victory Points Source',
              },
            },
            sessionMap: {
              galaxy: 'TI4 Galaxy',
              none: 'no galaxy has been uploaded yet',
              changeFile: 'Change the galaxy file',
              dropHere: 'Drop your galaxy here...',
              dragHere:
                "Drag 'n' drop your galaxy file here, or click to select the galaxy file",
              sizeHint:
                'Keep in mind that galaxies smaller than 800x800px are going to be small and unreadable',
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
              mapPositions: 'Map positions',
              colorsPicker: {
                sectionTitle: 'Assign plastic colors to factions',
              },
              vpChangeConfirmation: {
                title: 'You changed the VP target',
                content:
                  'You changed the Victory Point target.\nSome people already scored, so the game is probably in progress.\nAre you sure you want to change the Victory Point target of this game?',
              },
            },
            sessionTimeline: {
              events: {
                GameStarted: 'Game created',
                MapLinkUpdated: 'Map link updated',
                VpCountChanged: 'VP count changed',
                MapAdded: 'Galaxy added',
                ObjectiveScored: 'Objective scored',
                ObjectiveAdded: 'Objective revealed',
                TimelineUserEvent: 'User added event',
                VictoryPointsUpdated: 'VP scored',
                SessionSummary: 'Game finished!',
                AgendaVotedOn: {
                  0: 'Directive voted on',
                  1: 'Law voted on',
                },
                LawRemoved: 'Law Removed',
                RelicDrawn: 'Relic drawn',
                RelicUsed: 'Relic used',
              },
              withDraft: 'Players will draft their factions',
              banned: '{{player}} banned:',
              picked: '{{player}} picked:',
              tableSpotPicked: 'Picked position at the table',
              speakerPicked: 'Speaker picked by {{player}}',
              speakerAssigned: 'Speaker: {{speaker}}',
              draftSummary: {
                title: 'Draft finished',
                speaker: 'Speaker: {{speaker}}',
                toggleGalaxy: 'Show galaxy',
                galaxy: 'Galaxy',
              },
              sessionSummary: {
                title: 'Game finished!',
                winner: 'Winner',
                results: 'Results',
              },
              vpCountChanged: '{{from}} -> {{to}}',
              vpSource: {
                [VP_SOURCE.objective]: 'Objective',
                [VP_SOURCE.custodian]: 'First to control Mecatol Rex',
                [VP_SOURCE.support]: 'Support for the Throne promissory note',
                [VP_SOURCE.emphidia]:
                  'Found the Crown of Emphidia while controlling the Tomb of Emphidia',
                [VP_SOURCE.shard]: 'Shard of the Throne changed hands',
                [VP_SOURCE.mecatol]: 'Controlled Rex on Imperial primary',
                [VP_SOURCE.agenda]: 'Gained point in politics phase',
              },
              changeFile: 'Change the image',
              dropHere: 'Drop your image here...',
              dragHere: "Drag 'n' drop your image here, or click to select it",
              submit: 'save',
              cta: 'save a moment',
              titleLabel: 'what happened?!',
              descriptionLabel: "what's the story?",
            },
            togglePlastic: {
              tooltip: 'toggle plastic colors',
              nowOn: 'now on',
              nowOff: 'now off',
            },
            share: {
              copied: 'Copied!',
              tooltip: 'show qr code',
              allowEdit: 'allow edit',
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
              yourListIdentifier: 'Code of this list: {{listId}}',
              done: 'Finished',
              inProgress: 'In progress',
              locked: 'Locked for edit',
              delete: 'Delete',
              secondaryTitle: '(factions: {{factionList}})',
              cta: {
                draft: 'Draft factions',
                set: 'Record a session',
              },
              confirmDelete:
                'Are you sure you want to delete "{{sessionName}}" session?',
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
                technology: {
                  button: 'See technologies and units',
                  title: 'Technologies and units',
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
              units: {
                0: 'Transporter',
                1: 'Destroyer',
                2: 'Fighter',
                3: 'Cruiser',
                4: 'Dreadnought',
                5: 'Flagship',
                6: 'Warsun',
                7: 'PDS',
                8: 'Infantry',
                9: 'Mech',
                10: 'Dice',
              },
            },
            deletePO: {
              tooltip: 'Remove Public Objective',
              content:
                'There are already points scored, are you sure you want to delete a Public Objective?',
            },
            panicPage: {
              message:
                "Something went wrong, please try again and if it doesn't help, you can try notifying this guy:",
              or: 'or you can',
              submitAnIssue: 'submit an issue on github',
            },
            letsFight: {
              roll: 'roll',
              clear: 'clear',
              hideOpponentRoller: 'hide opponent roller',
              showOpponentRoller: 'roll for opponent',
              hits: 'Hits: <strong>{{hits}}</strong>',
            },
          },
        },
        pl: {
          codex3: {
            objectives: objectivesI18n.pl.codex3,
            explorationCards: explorationI18n.pl.codex3,
          },
          translation: {
            objectives: objectivesI18n.pl.translation,
            explorationCards: explorationI18n.pl.codex3,
            general: {
              switchLanguage: 'Zmień język',
              home: 'Home',
              title: 'TI4 Companion',
              edit: 'Edytuj',
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
                galaxy: 'Galaktyka',
                details: 'Szczegóły',
              },
              overview: {
                goToWiki: 'przejdź do wiki',
                openOriginal: 'otwórz oryginalny obraz',
                sessionStart: 'kiedy sesja: {{when}}',
              },
            },
            sessionMap: {
              galaxy: 'Galaktyka TI4',
              none: 'Galaktyka nie została dodana',
              changeFile: 'Zmień plik galaktyki',
              dropHere: 'Przeciągnij galaktykę tutaj...',
              dragHere: 'Przeciągnij i upuść, lub kliknij by wybrać plik',
              sizeHint:
                'Miej na uwadze, że galaktyki mniejsze niż 800x800px mogą być nieczytelne',
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
              secondaryTitle: '(rasy: {{factionList}})',
              delete: 'Usuń',
              confirmDelete:
                'Czy na pewno chcesz usunąć sesję {{sessionName}}?',
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
