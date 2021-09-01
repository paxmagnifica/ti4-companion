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

import { factionsList } from './gameInfo/factions'

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'sticky',
    right: 0,
    bottom: 0,
    zIndex: 9001,
  },
  containedButton: {
    '&:not(.MuiButton-containedPrimary)': {
      backgroundColor: 'transparent',
    },
  }
}))

function NewSession({
  onSessionCreated
}) {
  const classes = useStyles()
  const [selected, setSelected] = useState([])
  const isSelected = useCallback(factionKey => selected.includes(factionKey), [selected])
  const toggleSelection = useCallback(factionKey => isSelected(factionKey)
    ? setSelected(selected => selected.filter(faction => faction !== factionKey))
    : setSelected(selected => [...selected, factionKey]),
    [setSelected, isSelected]
  )

  const createSession = useCallback(() => {
    onSessionCreated(selected)
  }, [selected, onSessionCreated]);

  return <>
    <Box mb={2}>
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
          color={isSelected(faction.key) ? 'primary' : 'default'}
          startIcon={<Avatar alt={faction.name} src={faction.image} />}
        >
            {faction.name}
        </Button>
      </Grid>)}
      <Fab
        onClick={createSession}
        color="secondary"
        aria-label="add"
        className={classes.fab}
        disabled={!selected.length}
      >
        <Check />
      </Fab>
    </Grid>
  </>
}

export default NewSession;
