import React, { useContext } from 'react'

import { saveAllSessions } from './shared/persistence'

export const StateContext = React.createContext()
export const ComboDispatchContext = React.createContext()
export const DispatchContext = React.createContext()

export const useDispatch = () => {
  const dispatch = useContext(DispatchContext)

  return dispatch
}

export const useComboDispatch = () => {
  const dispatch = useContext(ComboDispatchContext)

  return dispatch
}

export const init = () => ({
  relics: {
    loading: false,
    loaded: false,
    data: {},
    slugs: [],
  },
  explorationCards: {
    loading: false,
    loaded: false,
    data: {},
    slugs: [],
  },
  objectives: {
    loading: true,
    loaded: false,
    data: {},
    slugs: [],
  },
  sessions: {
    loading: true,
    loaded: false,
    data: [],
  },
})

export const reducer = (state, action) => {
  switch (action.type) {
    case 'LoadSessions':
      return {
        ...state,
        sessions: {
          loading: false,
          loaded: true,
          data: action.sessions,
        },
      }
    case 'AddSession':
      return addSession(state, action)
    case 'LoadObjectives':
      return {
        ...state,
        objectives: {
          loading: false,
          loaded: true,
          data: action.objectives.reduce(
            (accu, obj) => ({ ...accu, [obj.slug]: obj }),
            {},
          ),
          slugs: action.objectives.map(({ slug }) => slug),
        },
      }
    case 'LoadingRelics':
      return {
        ...state,
        relics: {
          loading: true,
          loaded: false,
        },
      }
    case 'LoadRelics':
      return {
        ...state,
        relics: {
          loading: false,
          loaded: true,
          data: action.relics.reduce(
            (accu, obj) => ({ ...accu, [obj.slug]: obj }),
            {},
          ),
          slugs: action.relics.map(({ slug }) => slug),
        },
      }
    case 'LoadingExplorationCards':
      return {
        ...state,
        explorationCards: {
          loading: true,
          loaded: false,
        },
      }
    case 'LoadExplorationCards':
      return {
        ...state,
        explorationCards: {
          loading: false,
          loaded: true,
          data: action.explorationCards.reduce(
            (accu, obj) => ({ ...accu, [obj.slug]: obj }),
            {},
          ),
          slugs: action.explorationCards.map(({ slug }) => slug),
        },
      }
    case 'CreateGameSession':
      return {
        ...state,
        sessions: {
          loading: false,
          loaded: true,
          data: [action.session, ...state.sessions.data],
        },
      }
    case 'VictoryPointsUpdated':
      return updateVictoryPoints(state, action.payload)
    case 'FactionsShuffled':
      return factionsShuffled(state, action)
    case 'SetSessionMap':
      return setMap(state, action.payload)
    case 'ObjectiveAdded':
      return addObjective(state, action.payload)
    case 'ObjectiveDeleted':
      return deleteObjective(state, action.payload)
    case 'ObjectiveScored':
      return scoreObjective(state, action.payload)
    case 'ObjectiveDescored':
      return descoreObjective(state, action.payload)
    case 'MetadataUpdated':
      return updatedMetadata(state, action.payload)
    case 'LockSession':
      return setSessionLock(state, action.payload, true)
    case 'UnlockSession':
      return setSessionLock(state, action.payload, false)
    default:
      console.error('unhandled action', action)

      return state
  }
}

const updateVictoryPoints = (state, payload) => {
  const sessionIndex = state.sessions.data.findIndex(
    (session) => session.id === payload.sessionId,
  )
  const session = state.sessions.data[sessionIndex]

  session.points = session.points.map(({ faction, points: previousPoints }) =>
    faction === payload.faction
      ? { faction, points: payload.points }
      : { faction, points: previousPoints },
  )

  session.finished = session.points.some(
    ({ points }) => points === session.vpCount,
  )

  const sessions = [...state.sessions.data]
  sessions.splice(sessionIndex, 1, { ...session })

  return {
    ...state,
    sessions: {
      ...state.sessions,
      data: sessions,
    },
  }
}

const setMap = (state, payload) => {
  const sessionIndex = state.sessions.data.findIndex(
    (session) => session.id === payload.sessionId,
  )
  const session = state.sessions.data[sessionIndex]

  session.map = payload.map
  const sessions = [...state.sessions.data]
  sessions.splice(sessionIndex, 1, { ...session })

  return {
    ...state,
    sessions: {
      ...state.sessions,
      data: sessions,
    },
  }
}

const addObjective = (state, payload) => {
  const sessionIndex = state.sessions.data.findIndex(
    (session) => session.id === payload.sessionId,
  )
  const session = state.sessions.data[sessionIndex]

  if (session.objectives.find((obj) => obj.slug === payload.slug)) {
    return state
  }

  session.objectives = [
    ...session.objectives,
    { slug: payload.slug, scoredBy: [] },
  ]
  const sessions = [...state.sessions.data]
  sessions.splice(sessionIndex, 1, { ...session })

  return {
    ...state,
    sessions: {
      ...state.sessions,
      data: sessions,
    },
  }
}

const deleteObjective = (state, payload) => {
  const sessionIndex = state.sessions.data.findIndex(
    (session) => session.id === payload.sessionId,
  )
  const session = state.sessions.data[sessionIndex]

  session.objectives = session.objectives.filter((o) => o.slug !== payload.slug)
  const sessions = [...state.sessions.data]
  sessions.splice(sessionIndex, 1, { ...session })

  return {
    ...state,
    sessions: {
      ...state.sessions,
      data: sessions,
    },
  }
}

const scoreObjective = (state, payload) => {
  const sessionIndex = state.sessions.data.findIndex(
    (session) => session.id === payload.sessionId,
  )
  const session = state.sessions.data[sessionIndex]

  session.objectives = session.objectives.map((obj) =>
    obj.slug === payload.slug
      ? {
          ...obj,
          scoredBy: [
            ...obj.scoredBy.filter((k) => k !== payload.faction),
            payload.faction,
          ],
        }
      : obj,
  )
  const sessions = [...state.sessions.data]
  sessions.splice(sessionIndex, 1, { ...session })

  return {
    ...state,
    sessions: {
      ...state.sessions,
      data: sessions,
    },
  }
}

const descoreObjective = (state, payload) => {
  const sessionIndex = state.sessions.data.findIndex(
    (session) => session.id === payload.sessionId,
  )
  const session = state.sessions.data[sessionIndex]

  session.objectives = session.objectives.map((obj) =>
    obj.slug === payload.slug
      ? {
          ...obj,
          scoredBy: obj.scoredBy.filter((sb) => sb !== payload.faction),
        }
      : obj,
  )
  const sessions = [...state.sessions.data]
  sessions.splice(sessionIndex, 1, { ...session })

  return {
    ...state,
    sessions: {
      ...state.sessions,
      data: sessions,
    },
  }
}

const updatedMetadata = (state, payload) => {
  const {
    sessionId,
    sessionDisplayName,
    isTTS,
    isSplit,
    sessionStart,
    sessionEnd,
    duration,
    vpCount,
  } = payload

  const sessionIndex = state.sessions.data.findIndex(
    (session) => session.id === sessionId,
  )
  const session = state.sessions.data[sessionIndex]

  session.displayName = sessionDisplayName
  session.tts = isTTS
  session.split = isSplit
  session.start = sessionStart
  session.end = sessionEnd
  session.duration = duration
  session.vpCount = vpCount

  const sessions = [...state.sessions.data]
  sessions.splice(sessionIndex, 1, { ...session })

  return {
    ...state,
    sessions: {
      ...state.sessions,
      data: sessions,
    },
  }
}

const addSession = (state, action) => {
  const oldSession = state.sessions.data.find((s) => s.id === action.session.id)
  const newSession = { ...action.session }
  if (oldSession) {
    newSession.editable = oldSession.editable || action.session.editable
    newSession.secret = action.session.editable
      ? action.session.secret
      : oldSession.secret
  }

  const sessions = [
    newSession,
    ...state.sessions.data.filter((s) => s.id !== action.session.id),
  ]
  saveAllSessions(sessions)

  return {
    ...state,
    sessions: {
      loading: false,
      loaded: true,
      data: sessions,
    },
  }
}

const factionsShuffled = (state, action) => {
  const sessionIndex = state.sessions.data.findIndex(
    (session) => session.id === action.payload.sessionId,
  )
  const session = state.sessions.data[sessionIndex]

  session.factions = action.payload.factions

  const sessions = [...state.sessions.data]
  sessions.splice(sessionIndex, 1, { ...session })

  return {
    ...state,
    sessions: {
      ...state.sessions,
      data: sessions,
    },
  }
}

const setSessionLock = (state, payload, sessionLock) => {
  const sessionIndex = state.sessions.data.findIndex(
    (session) => session.id === payload.sessionId,
  )
  const session = state.sessions.data[sessionIndex]

  session.locked = sessionLock

  const sessions = [...state.sessions.data]
  sessions.splice(sessionIndex, 1, { ...session })

  return {
    ...state,
    sessions: {
      ...state.sessions,
      data: sessions,
    },
  }
}
