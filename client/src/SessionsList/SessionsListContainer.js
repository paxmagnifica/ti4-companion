import { useCallback, useState, useEffect } from 'react'
import { Button, CircularProgress } from '@material-ui/core'
import { EditOutlined } from '@material-ui/icons'

import { getNewListIdentifier } from './getNewListIdentifier'
import { useSessionsList } from './queries'
import { SessionsList } from './SessionsList'
import Confirmation from '../shared/Confirmation'
import { deleteSession } from './removeSession'
import { Trans } from '../i18n'
import { ListIdentifierDialog } from './ListIdentifierDialog'

export function SessionsListContainer({ listIdentifier, setListIdentifier }) {
  const [loading, setLoading] = useState(true)
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
  const [identifierDialogOpen, setIdentifierDialogOpen] = useState(false)
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

  const onListIdentifierChanged = useCallback((identifier) => {
    setListIdentifier(identifier)
    setIdentifierDialogOpen(false)
  }, [])

  const { sessions, queryInfo, invalidateSessions } = useSessionsList({
    listId: listIdentifier,
  })

  if (loading || !queryInfo.isFetched) {
    return <CircularProgress />
  }

  return (
    <>
      <SessionsList
        onDeleteSession={(session) => {
          setSesssionToDelete(session)
          setConfirmationDialogOpen(true)
        }}
        sessions={sessions || []}
      />
      <Button
        startIcon={<EditOutlined />}
        style={{ marginTop: '0.5em' }}
        onClick={() => setIdentifierDialogOpen((a) => !a)}
      >
        <em style={{ fontSize: '.85em' }}>
          <Trans
            i18nKey="sessionList.yourListIdentifier"
            values={{ listId: listIdentifier }}
          />
        </em>
      </Button>
      <ListIdentifierDialog
        initialIdentifier={listIdentifier}
        onAccept={onListIdentifierChanged}
        onClose={() => setIdentifierDialogOpen(false)}
        open={identifierDialogOpen}
      />
      {sesssionToDelete && (
        <Confirmation
          cancel={() => {
            setSesssionToDelete(null)
            setConfirmationDialogOpen(false)
          }}
          confirm={async () => {
            await deleteSession(sesssionToDelete.id)
            setConfirmationDialogOpen(false)
            setSesssionToDelete(null)
            invalidateSessions()
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
