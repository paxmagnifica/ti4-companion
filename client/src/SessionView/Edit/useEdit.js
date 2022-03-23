import { useMemo, useState } from 'react'

export const useEdit = () => {
  const [enableEditDialogOpen, setEnableEditDialogOpen] = useState(false)
  const [confirmEditDisableOpen, setEditDisableConfirmationOpen] =
    useState(false)
  const [enableEditPromptOpen, setEnableEditPromptOpen] = useState(false)

  return useMemo(
    () => ({
      enableEditDialogOpen,
      setEnableEditDialogOpen,
      confirmEditDisableOpen,
      setEditDisableConfirmationOpen,
      enableEditPromptOpen,
      setEnableEditPromptOpen,
    }),
    [enableEditDialogOpen, confirmEditDisableOpen, enableEditPromptOpen],
  )
}
