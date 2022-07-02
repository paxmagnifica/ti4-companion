import { useMemo, useCallback, useState } from 'react'
import { TextField, IconButton } from '@material-ui/core'
import { Clear } from '@material-ui/icons'
import debounce from 'lodash.debounce'

import { useTranslation } from '../i18n'

function DebouncedTextField({ onChange, setLoading, debounceTime, ...others }) {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const debouncedOnChange = useMemo(
    () =>
      debounce(
        (search) => {
          onChange(search)
          setLoading(false)
        },
        debounceTime || 400,
        { trailing: true },
      ),
    [setLoading, onChange, debounceTime],
  )

  const clearValue = useCallback(() => {
    setValue('')
    onChange('')
    setLoading(false)
  }, [onChange, setLoading])

  const magic = useCallback(
    (e) => {
      setLoading(true)
      const search = e.target.value
      setValue(search)
      debouncedOnChange(search)
    },
    [debouncedOnChange, setLoading],
  )

  return (
    <TextField
      placeholder={t('general.labels.search')}
      {...others}
      InputProps={{
        endAdornment: (
          <>
            <IconButton onClick={clearValue} size="small">
              <Clear />
            </IconButton>
          </>
        ),
      }}
      onChange={magic}
      value={value}
    />
  )
}

export default DebouncedTextField
