import { useCallback, useState } from 'react'
import { Button, Grid, TextField, Link } from '@material-ui/core'

import { Trans } from '../../i18n'
import { useDomainErrors } from '../../shared/errorHandling'
import useInvalidateQueries from '../../useInvalidateQueries'

export function MapLink({
  link: initialLink,
  editable,
  sessionService,
  sessionId,
}) {
  const [link, setLink] = useState(initialLink || '')
  const [editing, setEditing] = useState(editable && !initialLink)
  const { setError } = useDomainErrors()
  const invalidateQueries = useInvalidateQueries()

  const saveMapLink = useCallback(async () => {
    try {
      const result = await sessionService.pushEvent(sessionId, {
        type: 'MapLinkUpdated',
        payload: link,
      })

      if (result.ok) {
        setEditing(false)
        invalidateQueries(['session', sessionId])
      }
    } catch (e) {
      setError(e)
    }
  }, [link, sessionId, sessionService, setError, invalidateQueries])

  if (initialLink && !editing) {
    return (
      <>
        <Grid item>
          <Link
            href={initialLink}
            rel="nofollow"
            style={{ color: 'white', lineBreak: 'anywhere' }}
            target="_blank"
          >
            {initialLink}
          </Link>
        </Grid>
        {editable && (
          <Grid item>
            <Button
              color="secondary"
              onClick={() => setEditing(true)}
              variant="contained"
            >
              <Trans i18nKey="general.edit" />
            </Button>
          </Grid>
        )}
      </>
    )
  }

  return (
    <>
      <Grid item>
        <TextField
          color="secondary"
          disabled={!editable}
          label="Link to the map"
          onChange={(e) => {
            const { value } = e.target

            setLink(value)
          }}
          style={{ minWidth: '40vw', maxWidth: '80vw' }}
          type="url"
          value={link}
        />
      </Grid>
      <Grid item>
        <Button
          color="secondary"
          disabled={!editable || !link}
          onClick={saveMapLink}
          variant="contained"
        >
          <Trans i18nKey="general.labels.save" />
        </Button>
      </Grid>
    </>
  )
}
