import { useState, useEffect } from 'react'
import { CircularProgress } from '@material-ui/core'

import { getNewListIdentifier } from './getNewListIdentifier'
import { useSessionsList } from './queries'
import { SessionsList } from './SessionsList'

const LIST_IDENTIFIER_KEY = 'paxmagnifica-ti4companion-list-identifier'

export function SessionsListContainer() {
  const [loading, setLoading] = useState(true)
  const [listIdentifier, setListIdentifier] = useState(
    localStorage.getItem(LIST_IDENTIFIER_KEY),
  )

  useEffect(() => {
    if (listIdentifier) {
      setLoading(false)

      return
    }

    getNewListIdentifier().then((identifier) => {
      localStorage.setItem(LIST_IDENTIFIER_KEY, identifier)
      setListIdentifier(identifier)
      setLoading(false)
    })
  }, [listIdentifier])

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
