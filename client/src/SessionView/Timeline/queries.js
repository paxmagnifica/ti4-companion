import { useQuery } from 'react-query'

const timelineKeys = {
  sessionTimeline: (sessionId) => ['session', sessionId, 'timeline'],
}

export const useTimelineEvents = ({ sessionId, sessionService }) => {
  const { data, ...queryInfo } = useQuery(
    timelineKeys.sessionTimeline(sessionId),
    async () => {
      const timeline = await sessionService.getTimeline(sessionId)

      return timeline
        .map((timelineEvent) => ({
          ...timelineEvent,
          payload: JSON.parse(timelineEvent.serializedPayload),
        }))
        .sort(({ order: orderA }, { order: orderB }) => orderB - orderA)
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
