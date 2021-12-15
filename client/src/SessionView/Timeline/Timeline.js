import { useState, useMemo, useCallback } from 'react'
import clsx from 'clsx'
import {
  Drawer,
  Grid,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@material-ui/core'
import {
  Timeline as MuiTimeline,
  TimelineOppositeContent,
  TimelineItem,
  TimelineConnector,
  TimelineSeparator,
  TimelineDot,
  TimelineContent,
} from '@material-ui/lab'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import { Trans, useTranslation } from 'react-i18next'
import {
  AccessibilityNew as UserEventIcon,
  Map as MapIcon,
  Add as AddIcon,
  Block as BannedIcon,
  PanTool as PickedIcon,
} from '@material-ui/icons'

import config from '../../config'
import Objective from '../../shared/Objective'
import FactionFlag from '../../shared/FactionFlag'
import useSmallViewport from '../../shared/useSmallViewport'
import ScrollToBottom from '../../shared/ScrollToBottom'
import useInvalidateQueries from '../../useInvalidateQueries'

import AddTimelineEvent from './AddTimelineEvent'
import { useTimelineEvents, timelineKeys } from './queries'

const Ti4TimelineContent = withStyles({
  root: {
    paddingTop: 0,
    paddingBottom: '3em',
    '& > h5:first-child': {
      marginBottom: '0.5em',
    },
  },
})(TimelineContent)

const Ti4TimelineItem = withStyles({
  root: {
    minHeight: 100,
  },
})(TimelineItem)

const Ti4TimelineDot = withStyles({
  root: {
    padding: '.3em',
    marginLeft: 0,
    marginRight: 0,
  },
})(TimelineDot)

const useStyles = makeStyles((theme) => ({
  mapContainer: {
    height: '96%',
    padding: theme.spacing(1),
  },
  draftSummaryMap: {
    maxWidth: '47vw',
  },
  bigDraftSummaryMap: {
    maxWidth: '87vw',
  },
  addNew: {
    minHeight: '0 !important',
  },
  addNewSeparator: {
    width: 600,
    maxWidth: '80%',
    '& button': {
      marginTop: 5,
      marginBottom: 15,
    },
  },
  banned: {
    backgroundColor: theme.palette.error.dark,
    opacity: '0.8',
  },
  picked: {
    backgroundColor: theme.palette.success.dark,
    opacity: '0.8',
  },
}))

function GameStarted({ payload, happenedAt, eventType }) {
  const { t } = useTranslation()

  return (
    <Ti4TimelineItem>
      <TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <Ti4TimelineDot title={t(`sessionTimeline.events.${eventType}`)} />
        <TimelineConnector />
      </TimelineSeparator>
      <Ti4TimelineContent>
        <Typography variant="h5">
          <Trans i18nKey={`sessionTimeline.events.${eventType}`} />
        </Typography>
        {payload.SetupType === 'draft' && (
          <Typography>
            <Trans i18nKey="sessionTimeline.withDraft" />
          </Typography>
        )}
        {(payload.Factions || []).map((faction) => (
          <Box key={faction} style={{ display: 'inline-block' }}>
            <FactionFlag
              disabled
              factionKey={faction}
              height="3em"
              selected
              width="4.5em"
            />
          </Box>
        ))}
      </Ti4TimelineContent>
    </Ti4TimelineItem>
  )
}

function VpCountChanged({ payload, happenedAt, eventType }) {
  const { t } = useTranslation()

  return (
    <Ti4TimelineItem>
      <TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <Ti4TimelineDot title={t(`sessionTimeline.events.${eventType}`)} />
        <TimelineConnector />
      </TimelineSeparator>
      <Ti4TimelineContent>
        <Typography variant="h5">
          <Trans i18nKey={`sessionTimeline.events.${eventType}`} />
        </Typography>
        <Typography variant="subtitle1">
          <Trans
            i18nKey="sessionTimeline.vpCountChanged"
            values={{ from: payload.from, to: payload.to }}
          />
        </Typography>
      </Ti4TimelineContent>
    </Ti4TimelineItem>
  )
}

function ObjectiveAdded({ eventType, payload, happenedAt }) {
  const small = useSmallViewport()
  const { t } = useTranslation()

  return (
    <Ti4TimelineItem>
      <TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <Ti4TimelineDot
          color="primary"
          title={t(`sessionTimeline.events.${eventType}`)}
        >
          <AddIcon />
        </Ti4TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <Ti4TimelineContent>
        <Typography variant="h5">
          <Trans i18nKey={`sessionTimeline.events.${eventType}`} />
        </Typography>
        <Box style={{ display: 'inline-block' }}>
          <Objective slug={payload.slug} small={small} />
        </Box>
      </Ti4TimelineContent>
    </Ti4TimelineItem>
  )
}

function ObjectiveScored({ payload, happenedAt, eventType }) {
  const small = useSmallViewport()
  const { t } = useTranslation()

  return (
    <Ti4TimelineItem>
      <TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <Box
          style={{ margin: '3px 0' }}
          title={t(`sessionTimeline.events.${eventType}`)}
        >
          <FactionFlag
            disabled
            factionKey={payload.faction}
            height="2.5em"
            selected
            width="4.5em"
          />
        </Box>
        <TimelineConnector />
      </TimelineSeparator>
      <Ti4TimelineContent>
        <Typography variant="h5">
          <Trans
            i18nKey="sessionTimeline.vp"
            values={{ points: payload.points }}
          />
        </Typography>
        <Box style={{ display: 'inline-block' }}>
          <Objective slug={payload.slug} small={small} />
        </Box>
      </Ti4TimelineContent>
    </Ti4TimelineItem>
  )
}

function VictoryPointsUpdated({ eventType, payload, happenedAt }) {
  const { t } = useTranslation()

  return (
    <Ti4TimelineItem>
      <TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <Box
          style={{ margin: '3px 0' }}
          title={t(`sessionTimeline.events.${eventType}`)}
        >
          <FactionFlag
            disabled
            factionKey={payload.faction}
            height="2.5em"
            selected
            width="4.5em"
          />
        </Box>
        <TimelineConnector />
      </TimelineSeparator>
      <Ti4TimelineContent>
        <Typography variant="h5">
          <Trans
            i18nKey="sessionTimeline.vp"
            values={{ points: payload.points }}
          />
        </Typography>
      </Ti4TimelineContent>
    </Ti4TimelineItem>
  )
}

function TimelineUserEvent({ eventType, payload, happenedAt }) {
  const { t } = useTranslation()

  return (
    <Ti4TimelineItem>
      <TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <Ti4TimelineDot
          color="primary"
          title={t(`sessionTimeline.events.${eventType}`)}
        >
          <UserEventIcon />
        </Ti4TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <Ti4TimelineContent>
        {payload.title && <Typography variant="h5">{payload.title}</Typography>}
        {payload.description && (
          <>
            <Typography>{payload.description}</Typography>
            <br />
          </>
        )}
        {payload.file && (
          <a href={payload.file} target="about:blank">
            <img
              alt={t(`sessionTimeline.events.${eventType}`)}
              src={payload.file}
              style={{ maxWidth: '100%' }}
            />
          </a>
        )}
      </Ti4TimelineContent>
    </Ti4TimelineItem>
  )
}

function ImageFromPayload({ eventType, Icon, payload, happenedAt }) {
  const { t } = useTranslation()

  return (
    <Ti4TimelineItem>
      <TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <Ti4TimelineDot
          color="primary"
          title={t(`sessionTimeline.events.${eventType}`)}
        >
          {Icon}
        </Ti4TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <Ti4TimelineContent>
        <a href={payload} target="about:blank">
          <img
            alt={t(`sessionTimeline.events.${eventType}`)}
            src={payload}
            style={{ maxWidth: '100%' }}
          />
        </a>
      </Ti4TimelineContent>
    </Ti4TimelineItem>
  )
}

function DebugEvent({ eventType, payload, happenedAt }) {
  if (!config.isDevelopment) {
    return null
  }

  return (
    <Ti4TimelineItem>
      <TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <Ti4TimelineDot title={eventType} />
        <TimelineConnector />
      </TimelineSeparator>
      <Ti4TimelineContent>
        <Typography variant="h5">{eventType}</Typography>
        <pre>{JSON.stringify(payload, null, 2)}</pre>
      </Ti4TimelineContent>
    </Ti4TimelineItem>
  )
}

function Banned({ eventType, payload, happenedAt }) {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <Ti4TimelineItem>
      <TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <Ti4TimelineDot
          className={classes.banned}
          title={t(`sessionTimeline.events.${eventType}`)}
        >
          <BannedIcon />
        </Ti4TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <Ti4TimelineContent>
        <Typography variant="h5">
          <Trans
            i18nKey="sessionTimeline.banned"
            values={{ player: payload.playerName }}
          />
        </Typography>
        {payload.bans.map((factionKey) => (
          <Box key={factionKey} style={{ display: 'inline-block' }}>
            <FactionFlag
              className={classes.banned}
              disabled
              factionKey={factionKey}
              height="3em"
              selected
              width="4.5em"
            />
          </Box>
        ))}
      </Ti4TimelineContent>
    </Ti4TimelineItem>
  )
}

function Picked({ eventType, payload, happenedAt }) {
  const { t } = useTranslation()

  return (
    <Ti4TimelineItem>
      <TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <Ti4TimelineDot
          color="primary"
          title={t(`sessionTimeline.events.${eventType}`)}
        >
          <PickedIcon />
        </Ti4TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <Ti4TimelineContent>
        <Typography variant="h5">
          <Trans
            i18nKey="sessionTimeline.picked"
            values={{ player: payload.playerName }}
          />
        </Typography>
        {payload.type === 'faction' ? (
          <Box key={payload.pick} style={{ display: 'inline-block' }}>
            <FactionFlag
              disabled
              factionKey={payload.pick}
              height="3em"
              selected
              width="4.5em"
            />
          </Box>
        ) : (
          <Typography>
            <Trans i18nKey="sessionTimeline.tableSpotPicked" />:{' '}
            <strong>P{payload.pick + 1}</strong>
          </Typography>
        )}
      </Ti4TimelineContent>
    </Ti4TimelineItem>
  )
}

function DraftSummary({ payload, happenedAt, session }) {
  const small = useSmallViewport()
  const { t } = useTranslation()
  const classes = useStyles()

  const withTablePositions = Boolean(session.setup.options?.tablePick)
  const showMap = withTablePositions && session.map
  const picks = useMemo(() => {
    if (withTablePositions) {
      const memoized = [...payload.picks]

      memoized.sort((a, b) => a.tablePosition - b.tablePosition)

      return memoized
    }

    return payload.picks
  }, [payload.picks, withTablePositions])

  const [mapDrawerOpen, setMapDrawerOpen] = useState(false)
  const toggleMapDrawer = useCallback(
    () => setMapDrawerOpen((smdo) => !smdo),
    [],
  )

  return (
    <>
      <Ti4TimelineItem>
        <TimelineOppositeContent>
          <Typography color="textSecondary">
            {new Date(happenedAt).toLocaleString()}
          </Typography>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <Ti4TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <Ti4TimelineContent>
          <Typography variant="h5">
            <Trans i18nKey="sessionTimeline.draftSummary.title" />
          </Typography>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Trans i18nKey="general.labels.player" />
                  </TableCell>
                  <TableCell>
                    <Trans i18nKey="general.labels.faction" />
                  </TableCell>
                  {withTablePositions && (
                    <TableCell>
                      <Trans i18nKey="general.labels.tablePosition" />
                      {showMap && (
                        <Button color="secondary" onClick={toggleMapDrawer}>
                          <em>
                            (
                            <Trans i18nKey="sessionTimeline.draftSummary.toggleMap" />
                            )
                          </em>
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {picks.map((pick) => (
                  <TableRow key={pick.playerName}>
                    <TableCell component="th" scope="row">
                      {pick.playerName}{' '}
                      <em>
                        {pick.playerName === payload.speaker
                          ? `(${t('general.labels.speaker')})`
                          : ''}
                      </em>
                    </TableCell>
                    <TableCell>
                      <FactionFlag
                        disabled
                        factionKey={pick.faction}
                        height="3em"
                        selected
                        width="4.5em"
                      />
                    </TableCell>
                    {withTablePositions && (
                      <TableCell>P{pick.tablePosition + 1}</TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Ti4TimelineContent>
      </Ti4TimelineItem>
      {showMap && (
        <Drawer anchor="left" onClose={toggleMapDrawer} open={mapDrawerOpen}>
          <Grid
            alignItems="center"
            className={classes.mapContainer}
            container
            direction="column"
            justifyContent="center"
          >
            <Grid item>
              <img
                alt={t('sessionTimeline.draftSummary.map')}
                className={clsx(classes.draftSummaryMap, {
                  [classes.bigDraftSummaryMap]: small,
                })}
                src={session.map}
              />
            </Grid>
          </Grid>
        </Drawer>
      )}
    </>
  )
}

function SpeakerSelected({ payload, happenedAt }) {
  return (
    <Ti4TimelineItem>
      <TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <Ti4TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <Ti4TimelineContent>
        <Typography variant="h5">
          <Trans
            i18nKey="sessionTimeline.speakerAssigned"
            values={{ speaker: payload.speakerName }}
          />
        </Typography>
      </Ti4TimelineContent>
    </Ti4TimelineItem>
  )
}

function EventOnATimeline({ eventType, payload, happenedAt, session }) {
  const props = { eventType, payload, happenedAt }
  switch (eventType) {
    case 'GameStarted':
      return <GameStarted {...props} />
    case 'VpCountChanged':
      return <VpCountChanged {...props} />
    case 'ObjectiveAdded':
      return <ObjectiveAdded {...props} />
    case 'VictoryPointsUpdated':
      return <VictoryPointsUpdated {...props} />
    case 'ObjectiveScored':
      return <ObjectiveScored {...props} />
    case 'MapAdded':
      return <ImageFromPayload Icon={<MapIcon />} {...props} />
    case 'TimelineUserEvent':
      return <TimelineUserEvent {...props} />
    case 'Banned':
      return <Banned {...props} />
    case 'Picked':
      return <Picked {...props} />
    case 'SpeakerSelected':
      return <SpeakerSelected {...props} />
    case 'DraftSummary':
      return <DraftSummary {...props} session={session} />
    default:
      return <DebugEvent {...props} />
  }
}

export function Timeline({ editable, session, sessionService }) {
  const { timeline } = useTimelineEvents({
    sessionId: session.id,
    sessionService,
  })
  const invalidateQueries = useInvalidateQueries()

  const uploadEvent = useCallback(
    async (payload) => {
      const result = await sessionService.addTimelineEvent(payload, session.id)
      if (result.ok) {
        invalidateQueries(timelineKeys.sessionTimeline(session.id))
      }
    },
    [session.id, sessionService, invalidateQueries],
  )

  const classes = useStyles()

  return (
    <>
      <MuiTimeline>
        {timeline
          .map((event) => (
            <EventOnATimeline {...event} key={event.order} session={session} />
          ))
          .filter(Boolean)}
        {editable && (
          <Ti4TimelineItem className={classes.addNew}>
            <TimelineOppositeContent />
            <TimelineSeparator className={classes.addNewSeparator}>
              <AddTimelineEvent uploadEvent={uploadEvent} />
            </TimelineSeparator>
            <Ti4TimelineContent />
          </Ti4TimelineItem>
        )}
      </MuiTimeline>
      <ScrollToBottom />
    </>
  )
}
