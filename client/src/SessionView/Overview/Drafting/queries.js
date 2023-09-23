import { useMutation, useQueryClient, useQuery } from 'react-query'

export const draftKeys = {
  draft: (sessionId) => ['session', sessionId, 'draft'],
  katowiceDraft: (sessionId) => ['session', sessionId, 'katowiceDraft'],
}

export const useDraftQuery = ({ sessionId, sessionService }) => {
  const { data, ...queryInfo } = useQuery(
    draftKeys.draft(sessionId),
    async () => {
      const session = await sessionService.get(sessionId)

      return session.draft
    },
  )

  return {
    draft: data,
    queryInfo,
  }
}

export const useKatowiceDraftQuery = ({ sessionId, sessionService }) => {
  const { data, ...queryInfo } = useQuery(
    draftKeys.katowiceDraft(sessionId),
    async () => {
      const session = await sessionService.get(sessionId)

      return session.katowiceDraft
    },
  )

  return {
    draft: data,
    queryInfo,
  }
}

export const useDraftMutation = ({ sessionId, mutation }) => {
  const queryClient = useQueryClient()
  const queryKey = draftKeys.draft(sessionId)
  const katowiceQueryKey = draftKeys.katowiceDraft(sessionId)

  return useMutation(mutation, {
    onSettled: () => {
      queryClient.invalidateQueries(queryKey)
      queryClient.invalidateQueries(katowiceQueryKey)
    },
  })
}
