import React from 'react'

export const StateContext = React.createContext();
export const DispatchContext = React.createContext();

export const init = () => {
  return {
    objectives: {
      loading: true,
      loaded: false,
      data: {},
    },
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
    case 'loadObjectives':
      return {
        ...state,
        objectives: {
          loading: false,
          loaded: true,
          data: action.objectives.reduce((accu, obj) => ({...accu, [obj.slug]: obj}), {}),
        }
      }
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
    case 'objectiveAdded':
      return addObjective(state, action.payload)
    case 'objectiveScored':
      return scoreObjective(state, action.payload)
    case 'objectiveDescored':
      return descoreObjective(state, action.payload)
    default:
      console.error('unhandled action', action)
      return state
  }
}

const updateVictoryPoints = (state, payload) => {
  const sessionIndex = state.sessions.data.findIndex(session => session.id === payload.sessionId)
  const session = state.sessions.data[sessionIndex]

  session.points = session.points.map(({faction, points: previousPoints}) => faction === payload.faction ? {faction, points: payload.points} : {faction, points: previousPoints})
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

const addObjective = (state, payload) => {
  const sessionIndex = state.sessions.data.findIndex(session => session.id === payload.sessionId)
  const session = state.sessions.data[sessionIndex]

  session.objectives = [...session.objectives, {slug: payload.slug, scoredBy: []}]
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

const scoreObjective = (state, payload) => {
  const sessionIndex = state.sessions.data.findIndex(session => session.id === payload.sessionId)
  const session = state.sessions.data[sessionIndex]

  session.objectives = session.objectives.map(obj => obj.slug === payload.slug
    ? {...obj, scoredBy: [...obj.scoredBy, payload.faction] }
    : obj)
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

const descoreObjective = (state, payload) => {
  const sessionIndex = state.sessions.data.findIndex(session => session.id === payload.sessionId)
  const session = state.sessions.data[sessionIndex]

  session.objectives = session.objectives.map(obj => obj.slug === payload.slug
    ? {...obj, scoredBy: obj.scoredBy.filter(sb => sb !== payload.faction) }
    : obj)
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
