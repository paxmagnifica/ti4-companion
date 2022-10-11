import { useState, useEffect } from 'react'
import { CircularProgress } from '@material-ui/core'

import { getNewListIdentifier } from './getNewListIdentifier'
import { useSessionsList } from './queries'
import { SessionsList } from './SessionsList'
import Confirmation from '../shared/Confirmation'
import { deleteSession } from './removeSession'
import { Trans } from '../i18n'

export function SessionsListContainer({ listIdentifier, setListIdentifier }) {
  const [loading, setLoading] = useState(true)
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
  const [sesssionToDelete, setSesssionToDelete] = useState(null)

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
      <SessionsList
        listId={listIdentifier}
        onDeleteSession={(session) => {
          setSesssionToDelete(session)
          setConfirmationDialogOpen(true)
        }}
        sessions={sessions || []}
      />
      {sesssionToDelete && (
        <Confirmation
          cancel={() => {
            setSesssionToDelete(null)
            setConfirmationDialogOpen(false)
          }}
          confirm={() => {
            deleteSession(sesssionToDelete.id)
            setConfirmationDialogOpen(false)
            setSesssionToDelete(null)
            // TODO replace this hacka-hacka reload with something better
            window.location.reload()
          }}
          open={confirmationDialogOpen}
          title={
            <Trans
              i18nKey="sessionList.confirmDelete"
              values={{ sessionName: sesssionToDelete.name }}
            />
          }
        />
      )}
    </>
  )
}
