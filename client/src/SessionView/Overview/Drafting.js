import { useState, useCallback } from 'react'
import { Grid, Box, Button, Typography } from '@material-ui/core'
import { PanTool as PickedIcon } from '@material-ui/icons'
import Alert from '@material-ui/lab/Alert'
import shuffle from 'lodash.shuffle'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import { DraftPool } from './DraftPool'
import { useDraftQuery, useDraftMutation } from './queries'

const PHASE = {
  bans: 'bans',
  picks: 'picks',
  speaker: 'speaker',
}

function Speaker({ disabled, draft, session, sessionService }) {
  const speakerMutation = useCallback(async () => {
    const shuffled = shuffle([...Array(draft.players.length).keys()])

    const speakerIndex = shuffled[0]
    const speakerName = draft.players[speakerIndex]

    await sessionService.pushEvent(session.id, {
      type: 'SpeakerSelected',
      payload: {
        sessionId: session.id,
        speakerIndex,
        speakerName,
      },
    })
  }, [sessionService, session.id, draft])

  const { mutate: selectRandomSpeaker } = useDraftMutation({
    sessionId: session.id,
    mutation: speakerMutation,
  })

  const commitDraftMutation = useCallback(async () => {
    await sessionService.pushEvent(session.id, {
      type: 'CommitDraft',
    })
    window.location.reload()
  }, [session.id, sessionService])

  const { mutate: commitDraft } = useDraftMutation({
    sessionId: session.id,
    mutation: commitDraftMutation,
  })

  return (
    <>
      <Typography variant="h2">
        speaker: {draft.speaker || 'not selected yet'}
      </Typography>
      {draft.speaker && (
        <Box mb={2}>
          <Button
            color="secondary"
            disabled={disabled}
            onClick={commitDraft}
            variant="contained"
          >
            commit draft & start session
          </Button>
        </Box>
      )}
      <Button
        color="primary"
        disabled={disabled}
        onClick={selectRandomSpeaker}
        variant="contained"
      >
        assign speaker at random
      </Button>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  containedButton: {
    transition: theme.transitions.create(
      ['opacity', 'background-color', 'color'],
      {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      },
    ),
    '&:not(.MuiButton-containedSecondary)': {
      backgroundColor: 'white',
    },
    '&:disabled': {
      color: 'black',
      opacity: 0.5,
    },
  },
  banned: {
    backgroundColor: `${theme.palette.error.light} !important`,
    opacity: '0.8 !important',
    '& .MuiButton-endIcon': {
      color: theme.palette.error.contrastText,
    },
  },
  picked: {
    backgroundColor: `${theme.palette.success.light} !important`,
    opacity: '0.8 !important',
    '& .MuiButton-endIcon': {
      color: theme.palette.success.contrastText,
    },
  },
}))

function TablePositionPick({
  disabled,
  pick,
  draft,
  selectedPosition,
  handleSelectedPosition,
}) {
  const classes = useStyles()

  return (
    <Grid container justifyContent="center" spacing={4}>
      {[...Array(draft.players.length).keys()].map((tablePositionIndex) => {
        const picked = draft.picks
          .filter(({ type }) => type === 'tablePosition')
          .find(({ pick: p }) => Number(p) === tablePositionIndex)
        const disabledDueToSelection =
          selectedPosition !== null && selectedPosition !== tablePositionIndex
        const isSelected =
          selectedPosition !== null && selectedPosition === tablePositionIndex

        return (
          <Grid key={tablePositionIndex} item lg={3} md={4} sm={6} xs={12}>
            <Button
              className={clsx(classes.containedButton, {
                [classes.picked]: picked,
              })}
              color={isSelected ? 'secondary' : 'default'}
              disabled={Boolean(
                disabled || disabledDueToSelection || picked || pick,
              )}
              endIcon={picked ? <PickedIcon fontSize="large" /> : null}
              fullWidth
              onClick={() => handleSelectedPosition(tablePositionIndex)}
              variant="contained"
            >
              {`P${tablePositionIndex + 1}`} on map
              {picked && (
                <Typography variant="caption">
                  picked by {picked.playerName}
                </Typography>
              )}
            </Button>
          </Grid>
        )
      })}
    </Grid>
  )
}

// TODO onPositionSelected ugly hack because of state being in the wrong place
function Pick({
  disabled,
  pick,
  clearSelection,
  draft,
  session,
  sessionService,
  onPositionSelected,
}) {
  const [selectedPosition, setSelectedPosition] = useState(null)
  const handleSelectedPosition = useCallback(
    (playerIndex) => {
      const value = selectedPosition === playerIndex ? null : playerIndex

      setSelectedPosition(value)
      onPositionSelected(value)
    },
    [selectedPosition, onPositionSelected],
  )
  const pickMutation = useCallback(async () => {
    await sessionService.pushEvent(session.id, {
      type: 'Picked',
      payload: {
        sessionId: session.id,
        pick: pick || selectedPosition,
        type: pick ? 'faction' : 'tablePosition',
        playerIndex: draft.order[draft.activePlayerIndex],
        playerName: draft.players[draft.order[draft.activePlayerIndex]],
      },
    })
    setSelectedPosition(null)
    onPositionSelected(null)
    clearSelection()
  }, [
    selectedPosition,
    clearSelection,
    sessionService,
    pick,
    session.id,
    draft,
    onPositionSelected,
  ])

  const { mutate: pickFaction } = useDraftMutation({
    sessionId: session.id,
    mutation: pickMutation,
  })

  return (
    <>
      <Typography variant="h2">
        picking: {draft.players[draft.order[draft.activePlayerIndex]]}
      </Typography>
      <Button
        color="secondary"
        disabled={disabled || (!pick && selectedPosition === null)}
        onClick={pickFaction}
        variant="contained"
      >
        pick
      </Button>
      {session.setup.options.tablePick && (
        <TablePositionPick
          disabled={
            disabled ||
            draft.picks.some(
              ({ type, playerIndex }) =>
                type === 'tablePosition' &&
                Number(draft.order[draft.activePlayerIndex]) ===
                  Number(playerIndex),
            )
          }
          draft={draft}
          handleSelectedPosition={handleSelectedPosition}
          pick={pick}
          selectedPosition={selectedPosition}
        />
      )}
    </>
  )
}

function Ban({
  disabled,
  bans,
  clearSelection,
  draft,
  sessionService,
  session,
}) {
  const banMutation = useCallback(async () => {
    await sessionService.pushEvent(session.id, {
      type: 'Banned',
      payload: {
        sessionId: session.id,
        bans,
        playerIndex: draft.order[draft.activePlayerIndex],
        playerName: draft.players[draft.order[draft.activePlayerIndex]],
      },
    })
    clearSelection()
  }, [bans, sessionService, session.id, draft, clearSelection])

  const { mutate: ban } = useDraftMutation({
    sessionId: session.id,
    mutation: banMutation,
  })

  return (
    <>
      <Typography variant="h3">
        banning: {draft.players[draft.order[draft.activePlayerIndex]]}
      </Typography>
      <Button
        color="secondary"
        disabled={disabled || bans.length < draft.bansPerRound}
        onClick={ban}
        variant="contained"
      >
        ban
      </Button>
    </>
  )
}

export function Drafting({ editable, session, sessionService }) {
  const [disableFactionSelection, setDisableFactionSelection] = useState(false)
  const [selected, setSelected] = useState([])
  const { draft } = useDraftQuery({
    sessionId: session.id,
    sessionService,
  })

  if (!draft) {
    return null
  }

  const pickOrBan = [PHASE.picks, PHASE.bans].includes(draft.phase)

  return (
    <>
      <Alert severity="warning">
        This is an early prototype of the drafting tool.
        <br />
        Please be patient with us, we are working to improve the UI and provide
        you with more drafting options.
        <br />
        If you run into an error, please be so kind as to write us a message in
        the chat (lower bottom corner) - it will help us immensely!
      </Alert>
      <Box mb={2}>
        <Typography variant="h1">phase: {draft.phase}</Typography>
        {pickOrBan && (
          <Typography>
            order: {JSON.stringify(draft.order.map((o) => draft.players[o]))}
          </Typography>
        )}
        {draft.phase === PHASE.picks && (
          <Pick
            clearSelection={() => setSelected([])}
            disabled={!editable}
            draft={draft}
            onPositionSelected={(selectedPosition) => {
              setDisableFactionSelection(selectedPosition !== null)
            }}
            pick={selected[0]}
            session={session}
            sessionService={sessionService}
          />
        )}
        {draft.phase === PHASE.bans && (
          <Ban
            bans={selected}
            clearSelection={() => setSelected([])}
            disabled={!editable}
            draft={draft}
            session={session}
            sessionService={sessionService}
          />
        )}
        {draft.phase === PHASE.speaker && (
          <Speaker
            disabled={!editable}
            draft={draft}
            session={session}
            sessionService={sessionService}
          />
        )}
      </Box>
      {draft.phase === PHASE.speaker && <Typography>picks:</Typography>}
      {session.setup.options.tablePick && draft.phase === PHASE.speaker && (
        <TablePositionPick disabled draft={draft} />
      )}
      <DraftPool
        bans={draft.bans}
        disabled={
          !editable ||
          draft.phase === PHASE.speaker ||
          disableFactionSelection ||
          draft.picks.some(
            ({ type, playerIndex }) =>
              type === 'faction' &&
              Number(draft.order[draft.activePlayerIndex]) ===
                Number(playerIndex),
          )
        }
        initialPool={
          pickOrBan
            ? draft.initialPool
            : draft.picks
                .filter(({ type }) => type === 'faction')
                .map(({ pick }) => pick)
        }
        max={1}
        onSelected={setSelected}
        picks={draft.picks}
        selected={selected}
      />
      {draft.phase === PHASE.speaker && (
        <>
          <Typography>bans:</Typography>
          <DraftPool
            bans={draft.bans}
            disabled
            initialPool={draft.bans.map(({ ban }) => ban)}
            max={1}
            onSelected={setSelected}
            picks={draft.picks}
            selected={selected}
          />
        </>
      )}
    </>
  )
}
