import { useState, useCallback, useMemo } from 'react'
import { Grid, Box, Button, Typography } from '@material-ui/core'
import {
  Block as BanIcon,
  PanTool as PickIcon,
  AssignmentInd as SpeakerIcon,
} from '@material-ui/icons'
import Alert from '@material-ui/lab/Alert'
import shuffle from 'lodash.shuffle'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import speakerFront from '../../../assets/speaker-front.png'
import speakerBack from '../../../assets/speaker-back.png'
import { Trans } from '../../../i18n'
import { useDomainErrors } from '../../../shared/errorHandling'
import { FactionImage } from '../../../shared/FactionImage'
import {
  ColorBox,
  getMapPositionName,
  getMapPositionColor,
} from '../../../shared'
import { MapPreview } from '../../components'
import { EditPrompt } from '../../Edit'
import { SessionNutshell } from '../SessionNutshell'

import { DraftPool } from './DraftPool'
import { useDraftQuery, useDraftMutation } from './queries'
import { PhaseStepper } from './components/PhaseStepper'
import { PickStepper } from './PickStepper'
import { SpeakerIndicator } from './SpeakerIndicator'
import { PHASE } from './shared'
import { PlayerActionsStepper } from './components/PlayerActionsStepper'

function Speaker({ disabled, draft, session, sessionService }) {
  const { setError } = useDomainErrors()
  const speakerMutation = useCallback(async () => {
    const shuffled = shuffle([...Array(draft.players.length).keys()])

    const speakerIndex = shuffled[0]
    const speakerName = draft.players[speakerIndex]

    try {
      await sessionService.pushEvent(session.id, {
        type: 'SpeakerSelected',
        payload: {
          sessionId: session.id,
          speakerIndex,
          speakerName,
        },
      })
    } catch (e) {
      setError(e)
    }
  }, [setError, sessionService, session.id, draft])

  const { mutate: selectRandomSpeaker } = useDraftMutation({
    sessionId: session.id,
    mutation: speakerMutation,
  })

  const commitDraftMutation = useCallback(async () => {
    try {
      await sessionService.pushEvent(session.id, {
        type: 'CommitDraft',
      })
    } catch (e) {
      setError(e)
    }
  }, [session.id, setError, sessionService])

  const { mutate: commitDraft } = useDraftMutation({
    sessionId: session.id,
    mutation: commitDraftMutation,
  })

  return (
    <>
      {draft.speaker && (
        <Box mb={2}>
          <EditPrompt>
            <Button
              color="secondary"
              disabled={disabled}
              onClick={commitDraft}
              variant="contained"
            >
              commit draft & start session
            </Button>
          </EditPrompt>
        </Box>
      )}
      <EditPrompt>
        <Button
          color="primary"
          disabled={disabled}
          onClick={selectRandomSpeaker}
          variant="contained"
        >
          assign speaker at random
        </Button>
      </EditPrompt>
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
  marginTop: {
    marginTop: theme.spacing(1),
  },
}))

function TablePositionPick({
  disabled,
  pick,
  draft,
  session,
  selectedPosition,
  handleSelectedPosition,
}) {
  const classes = useStyles()

  return (
    <Grid
      className={classes.marginTop}
      container
      justifyContent="center"
      spacing={4}
    >
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
            <EditPrompt fullWidth>
              <Button
                className={clsx(classes.containedButton, {
                  [classes.picked]: picked,
                })}
                color={isSelected ? 'secondary' : 'default'}
                disabled={Boolean(
                  disabled || disabledDueToSelection || picked || pick,
                )}
                endIcon={picked ? <PickIcon fontSize="large" /> : null}
                fullWidth
                onClick={() => handleSelectedPosition(tablePositionIndex)}
                variant="contained"
              >
                <Typography
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gridColumnGap: '0.3em',
                  }}
                >
                  {getMapPositionName({
                    mapPositions: session.mapPositions,
                    position: tablePositionIndex,
                  })}
                  <ColorBox
                    color={getMapPositionColor({
                      mapPositions: session.mapPositions,
                      position: tablePositionIndex,
                    })}
                    disabled
                  />
                </Typography>
                {picked && (
                  <Typography style={{ marginLeft: '0.3em' }} variant="caption">
                    picked by {picked.playerName}
                  </Typography>
                )}
              </Button>
            </EditPrompt>
          </Grid>
        )
      })}
    </Grid>
  )
}

function SpeakerSelectorToggle({ selected, onChange, disabled, cannotSelect }) {
  const classes = useStyles()

  const onClick = () => {
    onChange(!selected)
  }

  return (
    <Grid
      className={classes.marginTop}
      container
      justifyContent="center"
      spacing={4}
    >
      <Grid item>
        <div
          onClick={onClick}
          style={{
            cursor: disabled || cannotSelect ? 'auto' : 'pointer',
            borderRadius: '2%',
            width: '200px',
            height: '81px',
            backgroundSize: '100% auto',
            border: `2px solid ${selected ? '#f50057' : 'transparent'}`,
            opacity: !selected || disabled || cannotSelect ? 0.7 : 1,
            backgroundImage: cannotSelect
              ? `url(${speakerBack})`
              : `url(${speakerFront})`,
          }}
          title={cannotSelect ? 'already selected' : 'select speaker'}
        />
      </Grid>
    </Grid>
  )
}

// TODO onPositionSelected ugly hack because of state being in the wrong place
// same with onSpeakerSelected (heh)
function Pick({
  disabled,
  pick,
  clearSelection,
  draft,
  session,
  sessionService,
  onPositionSelected,
  onSpeakerSelected,
}) {
  const [speakerSelected, setSpeakerSelected] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState(null)
  const { setError } = useDomainErrors()
  const handleSpeakerSelected = useCallback(
    (v) => {
      setSpeakerSelected(v)
      onSpeakerSelected(v)
    },
    [onSpeakerSelected],
  )
  const handleSelectedPosition = useCallback(
    (playerIndex) => {
      const value = selectedPosition === playerIndex ? null : playerIndex

      setSelectedPosition(value)
      onPositionSelected(value)
    },
    [selectedPosition, onPositionSelected],
  )
  const pickMutation = async () => {
    let eventPick = pick || selectedPosition
    if (speakerSelected) {
      eventPick = 'speaker'
    }

    let eventType = pick ? 'faction' : 'tablePosition'
    if (speakerSelected) {
      eventType = 'speaker'
    }

    try {
      await sessionService.pushEvent(session.id, {
        type: 'Picked',
        payload: {
          sessionId: session.id,
          pick: eventPick,
          type: eventType,
          playerIndex: draft.order[draft.activePlayerIndex],
          playerName: draft.players[draft.order[draft.activePlayerIndex]],
        },
      })
      setSelectedPosition(null)
      onPositionSelected(null)
      handleSpeakerSelected(false)
      clearSelection()
    } catch (e) {
      setError(e)
    }
  }

  const { mutate: pickFaction } = useDraftMutation({
    sessionId: session.id,
    mutation: pickMutation,
  })

  return (
    <>
      <EditPrompt>
        <Button
          color="secondary"
          disabled={
            disabled || (!pick && selectedPosition === null && !speakerSelected)
          }
          onClick={pickFaction}
          variant="contained"
        >
          pick{' '}
          {session.setup.options.tablePick ? ' (faction or table spot)' : ''}
          {session.setup.options.speakerPick ? ' (or speaker)' : ''}
        </Button>
      </EditPrompt>
      {session.setup.options.speakerPick && (
        <SpeakerSelectorToggle
          cannotSelect={draft.picks.some(({ type }) => type === 'speaker')}
          disabled={disabled}
          onChange={handleSpeakerSelected}
          selected={speakerSelected}
        />
      )}
      {session.setup.options.tablePick && (
        <TablePositionPick
          disabled={
            disabled ||
            speakerSelected ||
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
          session={session}
        />
      )}
    </>
  )
}

function BanStepper({ draft, setup }) {
  const { playerCount, bansPerRound, banRounds } = setup.options

  const steps = new Array(playerCount * banRounds)
    .fill(0)
    .map((_p, playerIndex) => {
      const player = draft.players[playerIndex]
      const bans = new Array(bansPerRound)
        .fill(0)
        .map((_b, banIndex) => {
          const ban = draft.bans[playerIndex * bansPerRound + banIndex]

          return ban?.ban || null
        })
        .filter(Boolean)

      return {
        player,
        choice:
          bans.length === 0 ? null : (
            <>
              {bans.map((ban) => (
                <FactionImage
                  factionKey={ban}
                  style={{ width: 'auto', height: '100%' }}
                />
              ))}
            </>
          ),
      }
    })

  return (
    <>
      <Typography align="center" variant="h4">
        <Trans i18nKey={`drafting.speakerOrder.${draft.phase}.title`} />
      </Typography>
      <PlayerActionsStepper steps={steps} />
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
  const { setError } = useDomainErrors()
  const banMutation = useCallback(async () => {
    try {
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
    } catch (e) {
      setError(e)
    }
  }, [bans, setError, sessionService, session.id, draft, clearSelection])

  const { mutate: ban } = useDraftMutation({
    sessionId: session.id,
    mutation: banMutation,
  })

  const bansLeft = draft.bansPerRound - bans.length

  return (
    <EditPrompt>
      <Button
        color="secondary"
        disabled={disabled || bans.length < draft.bansPerRound}
        onClick={ban}
        variant="contained"
      >
        ban{bansLeft ? ` (left: ${bansLeft})` : ''}
      </Button>
    </EditPrompt>
  )
}

export function Drafting({ editable, session, sessionService }) {
  const [disableFactionSelection, setDisableFactionSelection] = useState(false)
  const [selected, setSelected] = useState([])
  const { draft } = useDraftQuery({
    sessionId: session.id,
    sessionService,
  })

  const bannedFactionKeys = useMemo(
    () => draft?.bans.map(({ ban }) => ban) || [],
    [draft?.bans],
  )

  const pickedFactionKeys = useMemo(
    () =>
      draft?.picks
        .filter(({ type }) => type === 'faction')
        .map(({ pick }) => pick) || [],
    [draft?.picks],
  )

  if (!draft) {
    return null
  }

  const phases = [
    session.setup?.options?.bans
      ? {
          phase: PHASE.bans,
          label: 'Ban',
          icon: <BanIcon />,
        }
      : null,
    {
      phase: PHASE.picks,
      label: 'Pick',
      icon: <PickIcon />,
    },
    session.setup?.options?.speakerPick
      ? null
      : {
          phase: PHASE.speaker,
          label: 'Speaker selection',
          icon: <SpeakerIcon />,
        },
  ].filter(Boolean)

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gridRowGap: '2em' }}
    >
      <SessionNutshell />
      <Typography align="center" variant="h4">
        Phase:
      </Typography>
      <PhaseStepper currentPhase={draft.phase} phases={phases} />
      {draft.phase === PHASE.bans && (
        <BanStepper draft={draft} setup={session.setup} />
      )}
      {draft.phase === PHASE.picks && (
        <PickStepper draft={draft} mapPositions={session.mapPositions} />
      )}
      {draft.phase === PHASE.speaker && (
        <SpeakerIndicator indicated={draft.speaker} players={draft.players} />
      )}
      <Box align="center" mb={2}>
        {draft.phase === PHASE.picks && (
          <Pick
            clearSelection={() => setSelected([])}
            disabled={!editable}
            draft={draft}
            onPositionSelected={(selectedPosition) => {
              setDisableFactionSelection(selectedPosition !== null)
            }}
            onSpeakerSelected={setDisableFactionSelection}
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
      <Box align="center" mb={2}>
        <MapPreview map={session.map} />
      </Box>
      {draft.phase === PHASE.speaker && <Typography>picks:</Typography>}
      {session.setup.options.tablePick && draft.phase === PHASE.speaker && (
        <TablePositionPick disabled draft={draft} session={session} />
      )}
      {draft.phase === PHASE.bans && (
        <DraftPool
          bans={draft.bans}
          disabled={
            !editable ||
            disableFactionSelection ||
            draft.picks.some(
              ({ type, playerIndex }) =>
                type === 'faction' &&
                Number(draft.order[draft.activePlayerIndex]) ===
                  Number(playerIndex),
            )
          }
          initialPool={draft.initialPool}
          max={draft.phase === PHASE.bans ? draft.bansPerRound : 1}
          onSelected={setSelected}
          picks={[]}
          selected={selected}
        />
      )}
      {draft.phase === PHASE.picks && (
        <DraftPool
          bans={[]}
          disabled={
            !editable ||
            disableFactionSelection ||
            draft.picks.some(
              ({ type, playerIndex }) =>
                type === 'faction' &&
                Number(draft.order[draft.activePlayerIndex]) ===
                  Number(playerIndex),
            )
          }
          initialPool={draft.initialPool.filter(
            (factionKey) => !bannedFactionKeys.includes(factionKey),
          )}
          max={1}
          onSelected={setSelected}
          picks={draft.picks}
          selected={selected}
        />
      )}

      {draft.phase === PHASE.speaker && (
        <DraftPool
          bans={[]}
          disabled
          initialPool={pickedFactionKeys}
          picks={draft.picks}
          selected={selected}
        />
      )}

      {/* show banned factions */}
      {draft.phase !== PHASE.bans && (
        <Box mt={2}>
          <Typography>bans:</Typography>
          <DraftPool
            bans={draft.bans}
            disabled
            initialPool={bannedFactionKeys}
            picks={draft.picks}
            selected={selected}
          />
        </Box>
      )}
      <Box mt={3}>
        <Alert severity="warning">
          This is an early prototype of the drafting tool.
          <br />
          Please be patient with us, we are working to improve the UI and
          provide you with more drafting options.
          <br />
          If you run into an error, please be so kind as to write us a message
          in the chat (lower bottom corner) - it will help us immensely!
        </Alert>
      </Box>
    </div>
  )
}
