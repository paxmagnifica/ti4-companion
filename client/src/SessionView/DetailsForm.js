import { useContext, useCallback, useState } from 'react'
import {
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Input,
  InputLabel,
  Paper,
  Snackbar,
} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';

import { ComboDispatchContext } from '../state'

const getNow = () => {
  const now = new Date()

  const nowString = `${now.getUTCFullYear()}-${now.getUTCMonth() < 9 ? '0' : ''}${now.getUTCMonth()+1}-${now.getUTCDate() < 10 ? '0' : ''}${now.getUTCDate()}`

  return nowString
}

function DetailsForm({
  session
}) {
  const [showSuccess, setShowSuccess] = useState(false)
  const handleSnackbarClose = useCallback(() => setShowSuccess(false), [])
  const comboDispatch = useContext(ComboDispatchContext)
  const [sessionDisplayName, setSessionDisplayname] = useState(session.displayName || '')
  const [isTTS, setIsTTS] = useState(session.tts || false)
  const [isSplit, setIsSplit] = useState(session.split || false)
  const [sessionStart, setSessionStart] = useState(session.start)
  const [sessionEnd, setSessionEnd] = useState(session.end)
  const [duration, setDuration] = useState(session.duration || 0)
  const getChangeHandler = useCallback((setter, propertyName = 'value') => (changeEvent, ...others) => {
    const v = changeEvent.target[propertyName]

    setter(v)
  }, [])
  const handleSave = useCallback(() => {
    const payload = {
      sessionId: session.id,
      sessionDisplayName,
      isTTS,
      isSplit,
      sessionStart: sessionStart || getNow(),
      sessionEnd: sessionEnd || getNow(),
      duration: Number(duration),
    }

    comboDispatch({ type: 'MetadataUpdated', payload })
    setShowSuccess(true)
  }, [session, sessionDisplayName, isTTS, isSplit, sessionStart, sessionEnd, duration, comboDispatch])

  return <>
    <Paper>
      <Container>
        <form noValidate autoComplete="off">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth color='secondary'>
                <InputLabel htmlFor="sessionName">Your session name</InputLabel>
                <Input
                  id="sessionName"
                  value={sessionDisplayName}
                  onChange={getChangeHandler(setSessionDisplayname)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormGroup row>
                <FormControlLabel
                  control={<Checkbox checked={isTTS} onChange={getChangeHandler(setIsTTS, 'checked')}/>}
                  label="TTS"
                />
                <FormControlLabel
                  control={<Checkbox checked={isSplit} onChange={getChangeHandler(setIsSplit, 'checked')}/>}
                  label="Split"
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth color='secondary'>
                <InputLabel htmlFor="sessionStart">Session date</InputLabel>
                <Input
                  id="sessionStart"
                  value={sessionStart || getNow()}
                  onChange={getChangeHandler(setSessionStart)}
                  type="date"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              {isSplit && <FormControl fullWidth color='secondary'>
                <InputLabel htmlFor="sessionEnd">Session end date</InputLabel>
                <Input
                  id="sessionEnd"
                  value={sessionEnd || getNow()}
                  onChange={getChangeHandler(setSessionEnd)}
                  type="date"
                />
              </FormControl>}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth color='secondary'>
                <InputLabel htmlFor="sessionDuration">How long did you play? (roughly)</InputLabel>
                <Input
                  id="sessionDuration"
                  value={duration}
                  inputProps={{ step: 0.25, min: 0}}
                  type="number"
                  onChange={getChangeHandler(setDuration)}
                  endAdornment='hours'
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} container justifyContent='flex-end'>
              <Button
                variant='contained'
                color='secondary'
                onClick={handleSave}
              >Save</Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Paper>
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={showSuccess}
      autoHideDuration={5000}
      onClose={handleSnackbarClose}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        severity="success"
      >
        Details saved correctly
      </MuiAlert>
    </Snackbar>
  </>
}

export default DetailsForm
