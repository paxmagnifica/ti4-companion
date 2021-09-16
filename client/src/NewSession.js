import { useCallback, useState } from 'react'
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
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom'

import * as sessionService from './shared/sessionService'

import { factionsList } from './gameInfo/factions'

const useStyles = makeStyles(theme => ({
  root: {
    color: 'white',
  },
  fab: {
    position: 'sticky',
    right: 0,
    bottom: 0,
    zIndex: 9001,
  },
  containedButton: {
    '&:not(.MuiButton-containedSecondary)': {
      backgroundColor: 'white',
    },
  }
}))

function NewSession({
  dispatch,
}) {
  const classes = useStyles()

  const [selectedFactions, setSelected] = useState([])
  const isSelected = useCallback(factionKey => selectedFactions.includes(factionKey), [selectedFactions])
  const toggleSelection = useCallback(factionKey => isSelected(factionKey)
    ? setSelected(selected => selected.filter(faction => faction !== factionKey))
    : setSelected(selected => [...selected, factionKey]),
    [setSelected, isSelected]
  )

  const history = useHistory()
  const createGameSession = useCallback(async () => {
    const session = await sessionService.createSession(selectedFactions)
    dispatch({type: 'CreateGameSession', session})
    history.push(`/${session.id}`)
  }, [history, dispatch, selectedFactions])

  return <>
    <Box
      className={classes.root}
      mb={2}
    >
      <Container>
        <Typography variant="h4">What factions are in the game?</Typography>
      </Container>
    </Box>

    <Grid container justifyContent="center" spacing={4}>
      {factionsList.map(faction => <Grid item xs={12} sm={6} md={4} lg={3} key={faction.key}>
        <Button
          className={classes.containedButton}
          fullWidth
          onClick={() => toggleSelection(faction.key)}
          variant='contained'
          color={isSelected(faction.key) ? 'secondary' : 'default'}
          startIcon={<Avatar alt={faction.name} src={faction.image} />}
        >
            {faction.name}
        </Button>
      </Grid>)}
      <Fab
        onClick={createGameSession}
        color="secondary"
        aria-label="add"
        className={classes.fab}
        disabled={!selectedFactions.length}
      >
        <Check />
      </Fab>
    </Grid>
  </>
}

export default NewSession;
