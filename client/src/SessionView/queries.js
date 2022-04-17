import { useQuery, useQueryClient, useMutation } from 'react-query'

import CONFIG from '../config'
import { handleErrors } from '../shared/errorHandling'
import { useFetch } from '../useFetch'
import { VP_SOURCE } from '../shared/constants'

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

export const useTimelineEvents = ({ sessionId }) => {
  const { fetch } = useFetch()

  const { data, ...queryInfo } = useQuery(
    queryKeys.timeline(sessionId),
    async () => {
      const timeline = await (
        await fetch(`${CONFIG.apiUrl}/api/sessions/${sessionId}/timeline`).then(
          handleErrors,
        )
      ).json()

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

const addPointSource = (
  fetch,
  sessionId,
  { faction, points, source, context },
) =>
  fetch(`${CONFIG.apiUrl}/api/sessions/${sessionId}/events`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventType: 'AddPointSource',
      serializedPayload: JSON.stringify({
        faction,
        points,
        source: VP_SOURCE.fromFrontendToBackend(source),
        context,
      }),
    }),
  }).then(handleErrors)
export const useAddPointSourceMutation = ({ sessionId }) => {
  const { fetch } = useFetch()
  const queryClient = useQueryClient()

  return useMutation((payload) => addPointSource(fetch, sessionId, payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.timeline(sessionId))
    },
  })
}
