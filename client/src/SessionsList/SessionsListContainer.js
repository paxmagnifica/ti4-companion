import { useState, useEffect } from 'react'
import { CircularProgress } from '@material-ui/core'

import { getNewListIdentifier } from './getNewListIdentifier'
import { useSessionsList } from './queries'
import { SessionsList } from './SessionsList'

export function SessionsListContainer({ listIdentifier, setListIdentifier }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (listIdentifier) {
      setLoading(false)

      return
    }

    getNewListIdentifier().then((identifier) => {
      setListIdentifier(identifier)
      setLoading(false)
    })
  }, [listIdentifier, setListIdentifier])

  const { sessions, queryInfo } = useSessionsList({ listId: listIdentifier })

  if (loading || !queryInfo.isFetched) {
    return <CircularProgress />
  }

  return (
    <>
      <SessionsList listId={listIdentifier} sessions={sessions || []} />
    </>
  )
}
