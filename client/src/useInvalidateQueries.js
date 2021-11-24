import { useCallback } from 'react'
import { useQueryClient } from 'react-query'

const useInvalidateQueries = () => {
  const queryClient = useQueryClient()

  return useCallback(
    (...queryKeys) => queryClient.invalidateQueries(...queryKeys),
    [queryClient],
  )
}

export default useInvalidateQueries
