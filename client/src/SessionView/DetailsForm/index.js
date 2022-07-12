import { useContext, useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Typography,
  Slider,
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
import MuiAlert from '@material-ui/lab/Alert'

import { Trans, useTranslation } from '../../i18n'
import { ComboDispatchContext } from '../../state'
import Confirmation from '../../shared/Confirmation'
import { GameVersionPicker } from '../../GameComponents'

import { ColorsPicker } from './ColorsPicker'

const getNow = () => {
  const now = new Date()

  const nowString = `${now.getUTCFullYear()}-${
    now.getUTCMonth() < 9 ? '0' : ''
  }${now.getUTCMonth() + 1}-${
    now.getUTCDate() < 10 ? '0' : ''
  }${now.getUTCDate()}`

  return nowString
}

const useStyles = makeStyles({
  root: {
    paddingTop: '4em',
  },
})

const vpMarks = [
  { value: 10, label: '10' },
  { value: 12, label: '12' },
  { value: 14, label: '14' },
]

function DetailsForm({ disabled, session }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [showSuccess, setShowSuccess] = useState(false)
  const handleSnackbarClose = useCallback(() => setShowSuccess(false), [])
  const comboDispatch = useContext(ComboDispatchContext)
  const [sessionDisplayName, setSessionDisplayname] = useState(
    session.displayName || '',
  )
  const [isTTS, setIsTTS] = useState(session.tts || false)
  const [isSplit, setIsSplit] = useState(session.split || false)
  const [sessionStart, setSessionStart] = useState(session.start)
  const [sessionEnd, setSessionEnd] = useState(session.end)
  const [duration, setDuration] = useState(session.duration || 0)
  const [vpCount, setVpCount] = useState(session.vpCount || 10)
  const [vpConfirmationOpen, setVpConfirmationOpen] = useState(false)
  const [colors, setColors] = useState(
    session.players.reduce(
      (acc, next) => ({ ...acc, [next.faction]: next.color }),
      {},
    ) || {},
  )
  const getChangeHandler = useCallback(
    (setter, propertyName = 'value') =>
      (changeEvent) => {
        const v = changeEvent.target[propertyName]

        setter(v)
      },
    [],
  )

  const handleSave = useCallback(async () => {
    const payload = {
      sessionId: session.id,
      sessionDisplayName,
      isTTS,
      isSplit,
      sessionStart: sessionStart || getNow(),
      sessionEnd: sessionEnd || getNow(),
      duration: Number(duration),
      vpCount,
      colors,
    }

    try {
      await comboDispatch({ type: 'MetadataUpdated', payload })
      setVpConfirmationOpen(false)
      setShowSuccess(true)
    } catch (e) {
      // empty catch
    }
  }, [
    colors,
    vpCount,
    session,
    sessionDisplayName,
    isTTS,
    isSplit,
    sessionStart,
    sessionEnd,
    duration,
    comboDispatch,
  ])

  const checkVpPointsBeforeSave = useCallback(() => {
    const startingVp = session.vpCount || 10

    if (
      session.points.some(({ points }) => points !== 0) &&
      startingVp !== vpCount
    ) {
      setVpConfirmationOpen(true)

      return
    }

    handleSave()
  }, [session, setVpConfirmationOpen, handleSave, vpCount])

  const closeConfirmation = useCallback(
    () => setVpConfirmationOpen(false),
    [setVpConfirmationOpen],
  )

  return (
    <>
      <Paper>
        <Container className={classes.root}>
          <GameVersionPicker disabled value={session.setup.gameVersion} />
          <form autoComplete="off" noValidate>
            <Grid container spacing={3}>
              <Grid item sm={2} xs={12}>
                <Typography gutterBottom id="discrete-slider-always">
                  Victory Points
                </Typography>
              </Grid>
              <Grid item sm={10} xs={12}>
                <Slider
                  color="secondary"
                  defaultValue={10}
                  disabled={disabled}
                  marks={vpMarks}
                  max={14}
                  min={10}
                  onChange={(_, newValue) => setVpCount(newValue)}
                  step={1}
                  value={vpCount}
                  valueLabelDisplay="on"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl color="secondary" disabled={disabled} fullWidth>
                  <InputLabel htmlFor="sessionName">
                    <Trans i18nKey="sessionDetails.name" />
                  </InputLabel>
                  <Input
                    id="sessionName"
                    onChange={getChangeHandler(setSessionDisplayname)}
                    value={sessionDisplayName}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isTTS}
                        onChange={getChangeHandler(setIsTTS, 'checked')}
                      />
                    }
                    disabled={disabled}
                    label={t('sessionDetails.tts')}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isSplit}
                        onChange={getChangeHandler(setIsSplit, 'checked')}
                      />
                    }
                    disabled={disabled}
                    label={t('sessionDetails.split')}
                  />
                </FormGroup>
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl color="secondary" disabled={disabled} fullWidth>
                  <InputLabel htmlFor="sessionStart">
                    <Trans i18nKey="sessionDetails.startDate" />
                  </InputLabel>
                  <Input
                    id="sessionStart"
                    onChange={getChangeHandler(setSessionStart)}
                    type="date"
                    value={sessionStart || getNow()}
                  />
                </FormControl>
              </Grid>
              <Grid item sm={6} xs={12}>
                {isSplit && (
                  <FormControl color="secondary" disabled={disabled} fullWidth>
                    <InputLabel htmlFor="sessionEnd">
                      <Trans i18nKey="sessionDetails.endDate" />
                    </InputLabel>
                    <Input
                      id="sessionEnd"
                      onChange={getChangeHandler(setSessionEnd)}
                      type="date"
                      value={sessionEnd || getNow()}
                    />
                  </FormControl>
                )}
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl color="secondary" disabled={disabled} fullWidth>
                  <InputLabel htmlFor="sessionDuration">
                    <Trans i18nKey="sessionDetails.duration" />
                  </InputLabel>
                  <Input
                    endAdornment={t('sessionDetails.durationUnit')}
                    id="sessionDuration"
                    inputProps={{ step: 0.25, min: 0 }}
                    onChange={getChangeHandler(setDuration)}
                    type="number"
                    value={duration}
                  />
                </FormControl>
              </Grid>
              <Grid item sm={6} xs={12} />
              {!session.isDraft && (
                <ColorsPicker
                  colors={colors}
                  disabled={disabled}
                  onChange={setColors}
                  players={session.players}
                />
              )}
              <Grid container item justifyContent="flex-end" xs={12}>
                {!disabled && (
                  <Button
                    color="secondary"
                    onClick={checkVpPointsBeforeSave}
                    variant="contained"
                  >
                    <Trans i18nKey="general.labels.save" />
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        </Container>
      </Paper>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        open={showSuccess}
      >
        <MuiAlert elevation={6} severity="success" variant="filled">
          <Trans i18nKey="sessionDetails.detailsSavedCorrectly" />
        </MuiAlert>
      </Snackbar>
      <Confirmation
        cancel={closeConfirmation}
        confirm={handleSave}
        open={vpConfirmationOpen}
        title={<Trans i18nKey="sessionDetails.vpChangeConfirmation.title" />}
      >
        {t('sessionDetails.vpChangeConfirmation.content')
          .split('\n')
          .map((thing) => (
            <Typography key={thing}>{thing}</Typography>
          ))}
      </Confirmation>
    </>
  )
}

export default DetailsForm
