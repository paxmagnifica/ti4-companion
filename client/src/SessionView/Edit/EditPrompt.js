import React, { useCallback } from 'react'

import { useSessionContext } from '../useSessionContext'

export function EditPrompt({ children, fullWidth }) {
  const {
    editable,
    editFeature: { setEnableEditPromptOpen },
  } = useSessionContext()

  const nonEditableCallback = useCallback(() => {
    if (editable) {
      return
    }

    setEnableEditPromptOpen(true)
  }, [editable, setEnableEditPromptOpen])

  return (
    <span
      onClick={nonEditableCallback}
      style={{
        width: fullWidth ? '100%' : 'auto',
        display: 'inline-flex',
      }}
    >
      {children}
    </span>
  )
}
