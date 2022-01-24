import { useState, useCallback, useMemo } from 'react'
import { Trans } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import { generatePath, useHistory } from 'react-router-dom'
import {
  Slider,
  Box,
  Container,
  Typography,
  FormGroup,
  TextField,
  FormControlLabel,
  Switch,
  Button,
} from '@material-ui/core'

import { factionsList } from '../gameInfo/factions'
import { SESSION_VIEW_ROUTES } from '../shared/constants'
import sessionFactory from '../shared/sessionService'
import { useDispatch } from '../state'

import { PasswordProtectionDialog } from './PasswordProtectionDialog'

const playerMarks = [
  { value: 4, label: '4' },
  { value: 6, label: '6' },
  { value: 8, label: '8' },
]

const useStyles = makeStyles((theme) => ({
  row: {
    marginBottom: theme.spacing(3),
  },
}))

export function DraftSetup() {
  const dispatch = useDispatch()
  const classes = useStyles()
  const [playerCount, setPlayerCount] = useState(6)
  const [players, setPlayers] = useState([
    'Player 1',
    'Player 2',
    'Player 3',
    'Player 4',
    'Player 5',
    'Player 6',
  ])

  const [bans, setBans] = useState(true)
  const toggleBans = useCallback(() => setBans((b) => !b), [])

  const [banRounds, setBanRounds] = useState(1)
  const handleBanRounds = useCallback((e) => {
    const { value } = e.currentTarget

    setBanRounds(Number(value))
  }, [])

  const [bansPerRound, setBansPerRound] = useState(1)
  const handleBansPerRound = useCallback((e) => {
    const { value } = e.currentTarget

    setBansPerRound(Number(value))
  }, [])

  const [tablePick, setTablePick] = useState(true)
  const toggleTablePick = useCallback(() => setTablePick((tp) => !tp), [])

  const history = useHistory()
  const sessionService = useMemo(() => sessionFactory({ fetch }), [])
  const startDraft = useCallback(
    async ({ password }) => {
      const session = await sessionService.createSession({
        password,
        setupType: 'draft',
        options: {
          initialPool: factionsList.map(({ key }) => key),
          players,
          bans,
          banRounds,
          bansPerRound,
          tablePick,
        },
      })
      dispatch({ type: 'CreateGameSession', session })
      history.push(
        generatePath(SESSION_VIEW_ROUTES.main, {
          sessionId: session.id,
        }),
        { secret: session.secret },
      )
    },
    [
      players,
      sessionService,
      bans,
      banRounds,
      bansPerRound,
      tablePick,
      dispatch,
      history,
    ],
  )
  const [passwordProtectionOpen, setPasswordProtectionOpen] = useState(false)
  const openPasswordProtection = useCallback(
    () => setPasswordProtectionOpen(true),
    [],
  )

  const handlePlayerCountChange = useCallback(
    (_, newValue) => {
      const diff = newValue - playerCount
      const newPlayers =
        diff < 0
          ? players.slice(0, diff)
          : [...Array(newValue).keys()].map(
              (playerIndex) =>
                players[playerIndex] || `Player ${playerIndex + 1}`,
            )

      setPlayerCount(newValue)
      setPlayers(newPlayers)
    },
    [playerCount, players],
  )
  const handlePlayerChange = useCallback((playerIndex, event) => {
    const { value } = event.currentTarget

    setPlayers((p) => [
      ...p.slice(0, playerIndex),
      value,
      ...p.slice(playerIndex + 1),
    ])
  }, [])

  return (
    <>
      <Box mb={2}>
        <Container>
          <Typography variant="h4">Setup your draft</Typography>
        </Container>
      </Box>

      <FormGroup className={classes.row} row>
        <FormControlLabel
          control={
            <Slider
              color="secondary"
              defaultValue={6}
              marks={playerMarks}
              max={8}
              min={2}
              onChange={handlePlayerCountChange}
              step={1}
              value={playerCount}
              valueLabelDisplay="on"
            />
          }
          label="Player count"
          labelPlacement="bottom"
          style={{ width: '100%' }}
        />
      </FormGroup>
      <FormGroup className={classes.row} row>
        {[...Array(playerCount).keys()].map((indice) => (
          <TextField
            key={`player${indice}`}
            color="secondary"
            disabled={!bans}
            label={`Player ${indice + 1}`}
            onChange={(e) => handlePlayerChange(indice, e)}
            value={players[indice] || ''}
            variant="filled"
          />
        ))}
      </FormGroup>
      <FormGroup className={classes.row} row>
        <FormControlLabel
          control={<Switch checked={bans} onChange={toggleBans} />}
          label="Bans"
        />
        <TextField
          color="secondary"
          disabled={!bans}
          inputProps={{ min: 0 }}
          label="rounds"
          onChange={handleBanRounds}
          type="number"
          value={banRounds}
          variant="filled"
        />
        <TextField
          color="secondary"
          disabled={!bans}
          inputProps={{ min: 0 }}
          label="bans per round"
          onChange={handleBansPerRound}
          type="number"
          value={bansPerRound}
          variant="filled"
        />
      </FormGroup>
      <FormGroup className={classes.row} row>
        <FormControlLabel
          control={<Switch checked={tablePick} onChange={toggleTablePick} />}
          label="pick place at the table as well as the faction"
        />
      </FormGroup>
      <Button
        color="secondary"
        onClick={openPasswordProtection}
        variant="contained"
      >
        <Trans i18nKey="general.labels.save" />
      </Button>
      <PasswordProtectionDialog
        callback={startDraft}
        onClose={() => setPasswordProtectionOpen(false)}
        open={passwordProtectionOpen}
      />
    </>
  )
}
