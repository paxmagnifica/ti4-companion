import { useQuery } from 'react-query'

import CONFIG from '../config'
import { handleErrors } from '../shared/errorHandling'
import { useFetch } from '../useFetch'

export const queryKeys = {
  session: (sessionId) => ['session', sessionId, 'data'],
  timeline: (sessionId) => ['session', sessionId, 'timeline'],
}

export const useSession = ({ sessionId, enabled }) => {
  const { fetch } = useFetch()

  const { data, ...queryInfo } = useQuery(
    queryKeys.session(sessionId),
    async () => {
      const result = await fetch(
        `${CONFIG.apiUrl}/api/sessions/${sessionId}`,
      ).then(handleErrors)

      const session = await result.json()

      return session
    },
    {
      enabled: enabled && Boolean(sessionId),
    },
  )

  return {
    session: data,
    queryInfo,
  }
}

const parsePayload = (serializedPayload) => {
  try {
    return JSON.parse(serializedPayload)
  } catch (e) {
    if (e.name === 'SyntaxError') {
      return serializedPayload
    }

    throw e
  }
}

export const useTimelineEvents = ({ sessionId, sessionService }) => {
  const { data, ...queryInfo } = useQuery(
    queryKeys.timeline(sessionId),
    async () => {
      const timeline = await sessionService.getTimeline(sessionId)

      return timeline
        .map((timelineEvent) => ({
          ...timelineEvent,
          payload: parsePayload(timelineEvent.serializedPayload),
        }))
        .sort(({ order: orderA }, { order: orderB }) => orderA - orderB)
    },
    {
      placeholderData: [],
    },
  )

  return {
    timeline: data,
    queryInfo,
  }
}
