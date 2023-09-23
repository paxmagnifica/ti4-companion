import { CircularProgress } from '@material-ui/core'
import { useState } from 'react'
import DebouncedTextField from '../DebouncedTextField'

export function SearchField({ onChange, gap, fullWidth }) {
  const [filtering, setFiltering] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gridColumnGap: gap || '0.2em',
        width: fullWidth ? '100%' : 'auto',
      }}
    >
      <DebouncedTextField
        onChange={onChange}
        setLoading={setFiltering}
        style={{ flexGrow: 1 }}
      />
      {filtering && <CircularProgress color="secondary" size={18} />}
    </div>
  )
}
