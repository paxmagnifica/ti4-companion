import { useQuery } from 'react-query'

const timelineKeys = {
  sessionTimeline: (sessionId) => ['session', sessionId, 'timeline'],
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
    timelineKeys.sessionTimeline(sessionId),
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
