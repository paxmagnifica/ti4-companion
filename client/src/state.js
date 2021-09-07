export const init = () => {
  return {
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
        sessions: {
          loading: false,
          loaded: true,
          data: [action.session, ...state.sessions.data]
        },
      }
    case 'updateVictoryPoints':
      return updateVictoryPoints(state, action.payload)
    case 'setFactions':
      const set_sessionIndex = state.sessions.data.findIndex(session => session.id === action.sessionId)
      const set_session = state.sessions.data[set_sessionIndex]

      set_session.factions = action.factions

      const set_sessions = [...state.sessions.data]
      set_sessions.splice(set_sessionIndex, 1, {...set_session})

      return {
        ...state,
        sessions: {
          ...state.sessions,
          data: set_sessions,
        }
      }
    default:
      console.error('unhandled action', action)
      return state
  }
}

const updateVictoryPoints = (state, payload) => {
  const sessionIndex = state.sessions.data.findIndex(session => session.id === payload.sessionId)
  const session = state.sessions.data[sessionIndex]

  session.points = session.points.map(([faction, previousPoints]) => faction === payload.faction ? [faction, payload.points] : [faction, previousPoints])
  const sessions = [...state.sessions.data]
  sessions.splice(sessionIndex, 1, {...session})

  return {
    ...state,
    sessions: {
      ...state.sessions,
      data: sessions,
    },
  }
}
