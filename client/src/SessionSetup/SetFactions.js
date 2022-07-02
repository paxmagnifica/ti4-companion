import { useMemo, useCallback, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Container,
  Fab,
  Grid,
  Typography,
} from '@material-ui/core'
import { Check } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { generatePath, useHistory } from 'react-router-dom'

import { Trans } from '../i18n'
import { SESSION_VIEW_ROUTES } from '../shared/constants'
import sessionFactory from '../shared/sessionService'
import { useFetch } from '../useFetch'
import { factionsList } from '../gameInfo/factions'
import { GameVersionPicker } from '../GameComponents'

import { PasswordProtectionDialog } from './PasswordProtectionDialog'

const useStyles = makeStyles({
  root: {
    color: 'white',
  },
  fab: {
    position: 'sticky',
    right: '1em',
    bottom: '1em',
    zIndex: 1199,
    float: 'right',
  },
  containedButton: {
    '&:not(.MuiButton-containedSecondary)': {
      backgroundColor: 'white',
    },
  },
})

export function SetFactions() {
  const classes = useStyles()

  const [gameVersion, setGameVersion] = useState()
  const [selectedFactions, setSelected] = useState([])
  const isSelected = useCallback(
    (factionKey) => selectedFactions.includes(factionKey),
    [selectedFactions],
  )
  const toggleSelection = useCallback(
    (factionKey) =>
      isSelected(factionKey)
        ? setSelected((selected) =>
            selected.filter((faction) => faction !== factionKey),
          )
        : setSelected((selected) => [...selected, factionKey]),
    [setSelected, isSelected],
  )

  const [passwordProtectionDialogOpen, setPasswordProtectionDialogOpen] =
    useState(false)
  const openPasswordProtectionDialog = useCallback(() => {
    setPasswordProtectionDialogOpen(true)
  }, [])

  const history = useHistory()
  const { fetch } = useFetch()
  const sessionService = useMemo(() => sessionFactory({ fetch }), [fetch])
  const createGameSession = useCallback(
    async ({ password }) => {
      setPasswordProtectionDialogOpen(false)
      const session = await sessionService.createSession({
        setupType: 'simple',
        gameVersion,
        factions: selectedFactions,
        password,
      })
      history.push(
        generatePath(SESSION_VIEW_ROUTES.main, {
          sessionId: session.id,
        }),
        { secret: session.secret },
      )
    },
    [history, selectedFactions, sessionService, gameVersion],
  )

  return (
    <>
      <GameVersionPicker onChange={setGameVersion} value={gameVersion} />

      <Box className={classes.root} mb={2}>
        <Container>
          <Typography variant="h4">
            <Trans i18nKey="sessionSetup.simple.title" />
          </Typography>
        </Container>
      </Box>

      <Grid container justifyContent="center" spacing={4}>
        {factionsList.map((faction) => (
          <Grid key={faction.key} item lg={3} md={4} sm={6} xs={12}>
            <Button
              className={classes.containedButton}
              color={isSelected(faction.key) ? 'secondary' : 'default'}
              fullWidth
              onClick={() => toggleSelection(faction.key)}
              startIcon={<Avatar alt={faction.name} src={faction.image} />}
              variant="contained"
            >
              <Trans i18nKey={`factions.${faction.key}.name`} />
            </Button>
          </Grid>
        ))}
      </Grid>
      <Fab
        aria-label="add"
        className={classes.fab}
        color="secondary"
        disabled={!selectedFactions.length}
        onClick={openPasswordProtectionDialog}
      >
        <Check />
      </Fab>
      <PasswordProtectionDialog
        callback={createGameSession}
        onClose={() => setPasswordProtectionDialogOpen(false)}
        open={passwordProtectionDialogOpen}
      />
    </>
  )
}
