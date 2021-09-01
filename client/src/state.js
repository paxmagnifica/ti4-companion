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
    default:
      console.error('unhandled action', action)
      return state
  }
}
