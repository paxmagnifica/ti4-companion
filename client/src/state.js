import shuffle from 'lodash.shuffle'

export const VIEWS = {
  LIST: 'list',
  NEW_GAME: 'new_game',
  SESSION: 'session',
}

export const init = () => {
  return {
    view: VIEWS.LIST,
    sessions: {
      loading: true,
      loaded: false,
      data: [],
    }
  }
}

export const reducer = (state, action) => {
  switch (action.type) {
    case 'loadSessions':
      return {
        ...state,
        sessions: {
          loading: false,
          loaded: true,
          data: action.sessions,
        }
      }
    case 'go':
      return { ...state, view: action.where, ...action.payload }
    case 'createGameSession':
      return {
        ...state,
        view: VIEWS.SESSION,
        sessionToView: action.session.id,
        sessions: {
          loading: false,
          loaded: true,
          data: [action.session, ...state.sessions.data]
        },
      }
    case 'shuffleFactions':
      const sessionIndex = state.sessions.data.findIndex(session => session.id === action.sessionId)
      const session = state.sessions.data[sessionIndex]

      session.factions = shuffle(session.factions)

      return {
        ...state,
        sessions: {
          ...state.sessions,
          data: [...state.sessions.data].splice(sessionIndex, 1, {...session})
        }
      }
    default:
      console.error('unhandled action', action)
      return state
  }
}
