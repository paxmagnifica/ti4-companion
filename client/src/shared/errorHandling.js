import React, { useContext, useCallback } from 'react'
import { Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import { Trans } from '../i18n'

export class DomainError extends Error {
  constructor(fetchResponse) {
    super(fetchResponse.statusText)
    this.domain = true
    this.status = fetchResponse.status
  }
}

export const handleErrors = async (response) => {
  if (response.ok) {
    return response
  }

  if (response.status === 400) {
    let body = null
    try {
      body = await response.json()
    } catch (_) {
      throw new DomainError(response)
    }

    if (body?.tiCompanionError) {
      throw new DomainError({
        statusText: 'Bad Request',
        status: body.tiCompanionError,
      })
    }
  }

  throw new DomainError(response)
}

export const DomainErrorContext = React.createContext()
export const useDomainErrors = () => {
  const { setError } = useContext(DomainErrorContext)

  const setOnlyDomainError = useCallback(
    (error) => {
      if (!error.domain) {
        throw error
      }

      setError(error)
    },
    [setError],
  )

  return { setError: setOnlyDomainError }
}

export const DomainErrorRenderer = () => {
  const { hasError, clearError, error } = useContext(DomainErrorContext)

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={7000}
      onClose={clearError}
      open={hasError}
    >
      {hasError ? (
        <Alert onClose={clearError} severity="error">
          <Trans i18nKey={`errors.${error.status}`} />
        </Alert>
      ) : undefined}
    </Snackbar>
  )
}
export const DomainErrorProvider = ({ error, setError, children }) => (
  <DomainErrorContext.Provider
    value={{
      hasError: Boolean(error),
      error,
      setError,
      clearError: () => setError(null),
    }}
  >
    {children}
    <DomainErrorRenderer />
  </DomainErrorContext.Provider>
)
