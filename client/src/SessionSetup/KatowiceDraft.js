import { useState, useCallback, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { generatePath, useHistory } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  FormGroup,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Slider,
} from '@material-ui/core'

import { Trans } from '../i18n'
import { SESSION_VIEW_ROUTES } from '../shared/constants'
import { MapPositions } from '../shared/MapPositions'
import sessionFactory from '../shared/sessionService'
import { useFetch } from '../useFetch'
import { GameVersionPicker, useFactionsList } from '../GameComponents'

import { PasswordProtectionDialog } from './PasswordProtectionDialog'
import { usePlayersAndMapPositions } from './usePlayersAndMapPositions'

const useStyles = makeStyles((theme) => ({
  row: {
    marginBottom: theme.spacing(3),
    gridColumnGap: '1.2em',
    gridRowGap: '1em',
  },
}))

const PLAYER_MARKS = [
  { value: 4, label: '4' },
  { value: 6, label: '6' },
  { value: 8, label: '8' },
]

const DEFAULT_PLAYER_COUNT = 6

export function KatowiceDraft() {
  const classes = useStyles()

  const [
    [mapPositions, setMapPositions],
    [players, setPlayers],
    [playerCount, setPlayerCount]
  ] = usePlayersAndMapPositions(DEFAULT_PLAYER_COUNT)

  const [gameVersion, setGameVersion] = useState()
  const { factions: factionsList } = useFactionsList(gameVersion)
  const [keepPlayerOrder, setKeepPlayerOrder] = useState(false)

  const history = useHistory()
  const { fetch } = useFetch()
  const sessionService = useMemo(() => sessionFactory({ fetch }), [fetch])
  const startDraft = useCallback(
    async ({ password }) => {
      const session = await sessionService.createSession({
        gameVersion,
        password,
        setupType: 'katowice_draft',
        options: {
          initialPool: factionsList,
          players,
          mapPositions,
          keepPlayerOrder,
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
      keepPlayerOrder,
      mapPositions,
      factionsList,
      players,
      sessionService,
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

      <Box mb={4}>
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
              marks={PLAYER_MARKS}
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
      <Typography>Players</Typography>
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
      <FormControlLabel
        control={
          <Switch
            checked={keepPlayerOrder}
            onChange={() => setKeepPlayerOrder((a) => !a)}
          />
        }
        label="Keep player order (do not randomize for pick/ban/nomination/draft)"
        style={{ marginBottom: '2em' }}
      />
      <Typography>Map positions</Typography>
      <FormGroup className={classes.row} row>
        <MapPositions
          onChange={(newPositions) => setMapPositions(newPositions)}
          value={mapPositions}
        />
      </FormGroup>
      <Button
        color="secondary"
        onClick={openPasswordProtection}
        variant="contained"
      >
        <Trans i18nKey="drafting.startCta" />
      </Button>
      <PasswordProtectionDialog
        callback={startDraft}
        onClose={() => setPasswordProtectionOpen(false)}
        open={passwordProtectionOpen}
      />
    </>
  )
}
