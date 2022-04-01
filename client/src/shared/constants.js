export const SESSION_VIEW_ROUTES = {
  main: '/:sessionId/:secret?',
  map: '/:sessionId/:secret?/map',
  details: '/:sessionId/:secret?/details',
  timeline: '/:sessionId/:secret?/timeline',
}

export const VP_SOURCE = {
  other: 'other',
  objective: 'objective',
  mecatol: 'mecatol',
  support: 'support',
  emphidia: 'emphidia',
  shard: 'shard',
  custodian: 'custodian', // TODO

  fromBackendToFrontend: (src) => Object.values(VP_SOURCE)[src],
  fromFrontendToBackend: (source) =>
    Object.values(VP_SOURCE).findIndex((x) => x === source),
}
