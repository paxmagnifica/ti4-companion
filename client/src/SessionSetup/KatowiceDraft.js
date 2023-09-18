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
} from '@material-ui/core'

import { Trans } from '../i18n'
import { SESSION_VIEW_ROUTES } from '../shared/constants'
import { MapPositions } from '../shared/MapPositions'
import sessionFactory from '../shared/sessionService'
import { useFetch } from '../useFetch'
import { GameVersionPicker, useFactionsList } from '../GameComponents'
import { colors as plasticColors } from '../shared/plasticColors'

import { PasswordProtectionDialog } from './PasswordProtectionDialog'

const useStyles = makeStyles((theme) => ({
  row: {
    marginBottom: theme.spacing(3),
  },
}))

const playerCount = 6

export function KatowiceDraft() {
  const classes = useStyles()

  const [gameVersion, setGameVersion] = useState()
  const { factions: factionsList } = useFactionsList(gameVersion)
  const [players, setPlayers] = useState([
    'Player 1',
    'Player 2',
    'Player 3',
    'Player 4',
    'Player 5',
    'Player 6',
  ])
  const [mapPositions, setMapPositions] = useState([
    { name: 'black', color: plasticColors.black },
    { name: 'yellow', color: plasticColors.yellow },
    { name: 'purple', color: plasticColors.purple },
    { name: 'red', color: plasticColors.red },
    { name: 'green', color: plasticColors.green },
    { name: 'blue', color: plasticColors.blue },
  ])

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
