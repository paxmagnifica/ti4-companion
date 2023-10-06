import { useState, useCallback, useMemo } from 'react'
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

import { Trans } from '../i18n'
import { SESSION_VIEW_ROUTES } from '../shared/constants'
import { MapPositions } from '../shared/MapPositions'
import sessionFactory from '../shared/sessionService'
import { useFetch } from '../useFetch'
import { GameVersionPicker, useFactionsList } from '../GameComponents'

import { PasswordProtectionDialog } from './PasswordProtectionDialog'
import { usePlayersAndMapPositions } from './usePlayersAndMapPositions'

const playerMarks = [
  { value: 4, label: '4' },
  { value: 6, label: '6' },
  { value: 8, label: '8' },
]

const useStyles = makeStyles((theme) => ({
  row: {
    marginBottom: theme.spacing(3),
    gridColumnGap: '1.2em',
    gridRowGap: '1em',
  },
}))

const DEFAULT_PLAYER_COUNT = 6

export function DraftSetup() {
  const classes = useStyles()

  const [gameVersion, setGameVersion] = useState()
  const { factions: factionsList } = useFactionsList(gameVersion)
  const [
    [mapPositions, setMapPositions],
    [players, setPlayers],
    [playerCount, setPlayerCount],
  ] = usePlayersAndMapPositions(DEFAULT_PLAYER_COUNT)

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
  const [speakerPick, setSpeakerPick] = useState(true)
  const toggleSpeakerPick = useCallback(() => setSpeakerPick((spp) => !spp), [])

  const history = useHistory()
  const { fetch } = useFetch()
  const sessionService = useMemo(() => sessionFactory({ fetch }), [fetch])
  const startDraft = useCallback(
    async ({ password }) => {
      const session = await sessionService.createSession({
        gameVersion,
        password,
        setupType: 'draft',
        options: {
          initialPool: factionsList,
          players,
          mapPositions,
          bans,
          banRounds,
          bansPerRound,
          tablePick,
          speakerPick,
        },
      })
      history.push(
        generatePath(SESSION_VIEW_ROUTES.main, {
          sessionId: session.id,
        }),
        { secret: session.secret },
      )
    },
    [
      mapPositions,
      factionsList,
      players,
      sessionService,
      bans,
      banRounds,
      bansPerRound,
      tablePick,
      speakerPick,
      history,
      gameVersion,
    ],
  )
  const [passwordProtectionOpen, setPasswordProtectionOpen] = useState(false)
  const openPasswordProtection = useCallback(
    () => setPasswordProtectionOpen(true),
    [],
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
      <GameVersionPicker onChange={setGameVersion} value={gameVersion} />

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
              onChange={setPlayerCount}
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
      <Typography>Player names</Typography>
      <FormGroup className={classes.row} row>
        {[...Array(playerCount).keys()].map((indice) => (
          <TextField
            key={`player${indice}`}
            color="secondary"
            label={`Player ${indice + 1}`}
            onChange={(e) => handlePlayerChange(indice, e)}
            value={players[indice] || ''}
            variant="filled"
          />
        ))}
      </FormGroup>
      <Typography>Map positions</Typography>
      <FormGroup className={classes.row} row>
        <MapPositions
          onChange={(newPositions) => setMapPositions(newPositions)}
          value={mapPositions}
        />
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
      <FormGroup className={classes.row} row>
        <FormControlLabel
          control={
            <Switch checked={speakerPick} onChange={toggleSpeakerPick} />
          }
          label="pick speaker instead of assigning at random"
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
