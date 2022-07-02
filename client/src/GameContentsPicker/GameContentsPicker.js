import { useEffect } from 'react'
import {
  FormGroup,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@material-ui/core'

export const GameVersion = {
  Base: 0,
  PoK: 1,
  PoK_Codex2: 2,
  PoK_Codex3: 3,
}

export const DEFAULT_VERSION = GameVersion.PoK_Codex2

export const GameContentsPicker = ({ value, onChange }) => {
  const getFromEvent = (event) => {
    const v = event.target.value
    onChange(Number(v))
  }

  useEffect(() => {
    if (!value) {
      onChange(DEFAULT_VERSION)
    }
  }, [value, onChange])

  return (
    <FormGroup row style={{ marginBottom: '5em' }}>
      <FormControlLabel
        control={
          <RadioGroup
            aria-label="gameVersion"
            name="gameVersion"
            onChange={getFromEvent}
            row
            value={value || DEFAULT_VERSION}
          >
            <FormControlLabel
              control={<Radio color="secondary" />}
              label="Base"
              labelPlacement="bottom"
              value={GameVersion.Base}
            />
            <FormControlLabel
              control={<Radio color="secondary" />}
              label="PoK"
              labelPlacement="bottom"
              value={GameVersion.PoK}
            />
            <FormControlLabel
              control={<Radio color="secondary" />}
              label="Codex 2"
              labelPlacement="bottom"
              value={GameVersion.PoK_Codex2}
            />
            <FormControlLabel
              control={<Radio color="secondary" />}
              label="Codex 3"
              labelPlacement="bottom"
              value={GameVersion.PoK_Codex3}
            />
          </RadioGroup>
        }
        label="Game version"
        labelPlacement="top"
        style={{ width: '100%' }}
      />
    </FormGroup>
  )
}
