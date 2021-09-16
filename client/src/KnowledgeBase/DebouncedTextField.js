import { useMemo, useCallback, useState } from 'react'
import {
  TextField,
  IconButton,
} from '@material-ui/core'
import { Clear } from '@material-ui/icons'
import debounce from 'lodash.debounce'

function DebouncedTextField({
  onChange,
  setLoading,
  debounceTime,
}) {
  const [value, setValue] = useState('')
  const debouncedOnChange = useMemo(() => debounce(search => {
    onChange(search)
    setLoading(false)
  }, debounceTime || 400, { trailing: true }), [setLoading, onChange, debounceTime])

  const clearValue = useCallback(() => {
    setValue('')
    onChange('')
    setLoading(false)
  }, [onChange, setLoading])

  const magic = useCallback(e => {
    setLoading(true)
    const search = e.target.value
    setValue(search)
    debouncedOnChange(search)
  }, [debouncedOnChange, setLoading])

  return <TextField
    value={value}
    onChange={magic}
    InputProps={{
      endAdornment: <>
        <IconButton size="small" onClick={clearValue}>
          <Clear />
        </IconButton>
      </>
    }}
  />
}

export default DebouncedTextField
