import { useCallback } from 'react'
import clsx from 'clsx'
import {
  Box,
  Typography,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import {
  Timeline as MuiTimeline,
  TimelineOppositeContent as Ti4TimelineOppositeContent,
  TimelineItem,
  TimelineConnector,
  TimelineSeparator,
  TimelineDot,
  TimelineContent,
} from '@material-ui/lab'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import {
  AccessibilityNew as UserEventIcon,
  Map as MapIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Block as BannedIcon,
  PanTool as PickedIcon,
  WhereToVote as SessionSummaryIcon,
} from '@material-ui/icons'

import { Trans, useTranslation } from '../../i18n'
import tradeGoods from '../../assets/tradegoods.png'
import config from '../../config'
import Objective from '../../shared/Objective'
import PlayerFlag from '../PlayerFlag'
import useSmallViewport from '../../shared/useSmallViewport'
import ScrollToBottom from '../../shared/ScrollToBottom'
import Relic from '../../shared/Relic'
import {
  getMapPositionName,
  getMapPositionColor,
  PointsWithDelta,
} from '../../shared'
import { ColorBox } from '../../shared/ColorBox'
import useInvalidateQueries from '../../useInvalidateQueries'
import { DraftSummaryTable } from '../components'
import { useTimelineEvents, queryKeys } from '../queries'
import { VP_SOURCE } from '../../shared/constants'
import speakerFront from '../../assets/speaker-front.png'

import { Agenda } from './Agenda'
import AddTimelineEvent from './AddTimelineEvent'
import { VictoryPoint } from './VictoryPoint'

const Ti4TimelineContent = withStyles({
  root: {
    paddingTop: 0,
    paddingBottom: '3em',
    '& > h5:first-child': {
      marginBottom: '0.5em',
    },
  },
})(TimelineContent)

const Ti4TimelineDot = withStyles({
  root: {
    padding: '.3em',
    marginLeft: 0,
    marginRight: 0,
  },
})(TimelineDot)

const useStyles = makeStyles((theme) => ({
  supportContent: {
    paddingTop: '1.6em',
    '& a': {
      textDecoration: 'none',
      color: 'white',
    },
    '& a:hover': {
      fontStyle: 'italic',
      textDecoration: 'none',
    },
  },
  supportDot: {
    backgroundColor: 'transparent',
    '& > img': {
      height: '4em',
    },
  },
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
  hideOpposite: {
    '&:before': {
      display: 'none',
    },
    '& .MuiTimelineItem-oppositeContent': {
      display: 'none',
    },
  },
  resultListIcon: {
    marginRight: theme.spacing(2),
  },
  paxMagnifica: {
    textAlign: 'center',
    fontSize: '1.5em',
    marginBottom: theme.spacing(2),
  },
}))

const Ti4TimelineItem = withStyles({
  root: {
    minHeight: 100,
  },
})((props) => {
  const small = useSmallViewport()
  const classes = useStyles()

  return (
    <TimelineItem
      {...props}
      className={clsx({ [classes.hideOpposite]: small })}
    />
  )
})

function GameStarted({ payload, happenedAt, eventType }) {
  const { t } = useTranslation()

  return (
    <Ti4TimelineItem>
      <Ti4TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </Ti4TimelineOppositeContent>
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
            <PlayerFlag
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
      <Ti4TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </Ti4TimelineOppositeContent>
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
      <Ti4TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </Ti4TimelineOppositeContent>
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

function AgendaVotedOn({ eventType, payload, happenedAt }) {
  const { t } = useTranslation()

  const voteResult = t(`components.agenda.voteResult.${payload.Result}`)
  const resultTitle = t(`components.agenda.resultTitle.${payload.Result}`, {
    voteResult,
    election: payload.Election,
  })

  return (
    <Ti4TimelineItem>
      <Ti4TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </Ti4TimelineOppositeContent>
      <TimelineSeparator>
        <Ti4TimelineDot
          color="primary"
          title={t(`sessionTimeline.events.${eventType}.${payload.Type}`)}
        >
          <AddIcon />
        </Ti4TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <Ti4TimelineContent>
        <Typography variant="h5">
          <Trans
            i18nKey={`sessionTimeline.events.${eventType}.${payload.Type}`}
          />
        </Typography>
        <Box style={{ display: 'inline-block' }}>
          <Typography variant="h6">{resultTitle}</Typography>
          <Agenda slug={payload.Slug} type={payload.Type} />
        </Box>
      </Ti4TimelineContent>
    </Ti4TimelineItem>
  )
}

function LawRemoved({ eventType, payload, happenedAt }) {
  const { t } = useTranslation()

  return (
    <Ti4TimelineItem>
      <Ti4TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </Ti4TimelineOppositeContent>
      <TimelineSeparator>
        <Ti4TimelineDot
          color="primary"
          title={t(`sessionTimeline.events.${eventType}`)}
        >
          <RemoveIcon />
        </Ti4TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <Ti4TimelineContent>
        <Typography variant="h5">
          <Trans i18nKey={`sessionTimeline.events.${eventType}`} />
        </Typography>
        <Box style={{ display: 'inline-block' }}>
          <Agenda slug={payload.Slug} />
        </Box>
      </Ti4TimelineContent>
    </Ti4TimelineItem>
  )
}

function ObjectiveScored({ payload, happenedAt, eventType, fromPoints }) {
  const small = useSmallViewport()
  const { t } = useTranslation()

  return (
    <Ti4TimelineItem>
      <Ti4TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </Ti4TimelineOppositeContent>
      <TimelineSeparator>
        <Box
          style={{ margin: '3px 0' }}
          title={t(`sessionTimeline.events.${eventType}`)}
        >
          <PlayerFlag
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
        <PointsWithDelta from={fromPoints} to={payload.points} />
        <Box style={{ display: 'inline-block' }}>
          <Objective slug={payload.slug} small={small} />
        </Box>
      </Ti4TimelineContent>
    </Ti4TimelineItem>
  )
}

function RelicEvent({ payload, happenedAt, eventType }) {
  const small = useSmallViewport()
  const { t } = useTranslation()

  return (
    <Ti4TimelineItem>
      <Ti4TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </Ti4TimelineOppositeContent>
      <TimelineSeparator>
        <Box
          style={{ margin: '3px 0' }}
          title={t(`sessionTimeline.events.${eventType}`)}
        >
          <PlayerFlag
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
          <Trans i18nKey={`sessionTimeline.events.${eventType}`} />
        </Typography>
        <Box style={{ display: 'inline-block' }}>
          <Relic slug={payload.slug} small={small} />
        </Box>
      </Ti4TimelineContent>
    </Ti4TimelineItem>
  )
}

function VictoryPointsUpdated({ eventType, fromPoints, payload, happenedAt }) {
  const { t } = useTranslation()

  if (payload.source === VP_SOURCE.fromFrontendToBackend(VP_SOURCE.objective)) {
    return (
      <ObjectiveScored
        eventType="ObjectiveScored"
        happenedAt={happenedAt}
        payload={{
          faction: payload.faction,
          points: payload.points,
          slug: payload.context,
        }}
      />
    )
  }

  return (
    <Ti4TimelineItem>
      <Ti4TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </Ti4TimelineOppositeContent>
      <TimelineSeparator>
        <Box
          style={{ margin: '3px 0' }}
          title={t(`sessionTimeline.events.${eventType}`)}
        >
          <PlayerFlag
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
        <PointsWithDelta from={fromPoints} to={payload.points} />
        {payload.source !== undefined && payload.source !== null && (
          <VictoryPoint
            context={payload.context}
            source={VP_SOURCE.fromBackendToFrontend(payload.source)}
          />
        )}
      </Ti4TimelineContent>
    </Ti4TimelineItem>
  )
}

function TimelineUserEvent({ eventType, payload, happenedAt }) {
  const { t } = useTranslation()

  return (
    <Ti4TimelineItem>
      <Ti4TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </Ti4TimelineOppositeContent>
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
      <Ti4TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </Ti4TimelineOppositeContent>
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
      <Ti4TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </Ti4TimelineOppositeContent>
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
      <Ti4TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </Ti4TimelineOppositeContent>
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
            <PlayerFlag
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

function Picked({ eventType, payload, happenedAt, mapPositions }) {
  const { t } = useTranslation()

  return (
    <Ti4TimelineItem>
      <Ti4TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </Ti4TimelineOppositeContent>
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
        {payload.type === 'faction' && (
          <Box key={payload.pick} style={{ display: 'inline-block' }}>
            <PlayerFlag
              disabled
              factionKey={payload.pick}
              height="3em"
              selected
              width="4.5em"
            />
          </Box>
        )}
        {payload.type === 'tablePosition' && (
          <Typography>
            <Trans i18nKey="sessionTimeline.tableSpotPicked" />:{' '}
            <strong>
              {getMapPositionName({
                mapPositions,
                position: payload.pick,
              })}
            </strong>
            <ColorBox
              color={getMapPositionColor({
                mapPositions,
                position: payload.pick,
              })}
              inline
            />
          </Typography>
        )}
        {payload.type === 'speaker' && (
          <Typography>
            <img
              alt={t('sessionTimeline.speakerPicked', {
                player: payload.playerName,
              })}
              src={speakerFront}
              style={{ width: '200px' }}
              title={t('sessionTimeline.speakerPicked', {
                player: payload.playerName,
              })}
            />
          </Typography>
        )}
      </Ti4TimelineContent>
    </Ti4TimelineItem>
  )
}

function SupportCreatorEvent() {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <Ti4TimelineItem>
      <Ti4TimelineOppositeContent className={classes.supportContent}>
        <Typography variant="h6">
          <Link
            href={t('support.buymeacoffee')}
            rel="nofollow"
            target="about:blank"
          >
            <Trans i18nKey="support.doYouLike" />
          </Link>
        </Typography>
      </Ti4TimelineOppositeContent>
      <TimelineSeparator>
        <Link
          href={t('support.buymeacoffee')}
          rel="nofollow"
          target="about:blank"
        >
          <Ti4TimelineDot className={classes.supportDot}>
            <img alt={t('general.labels.tg')} src={tradeGoods} />
          </Ti4TimelineDot>
        </Link>
        <TimelineConnector />
      </TimelineSeparator>
      <Ti4TimelineContent className={classes.supportContent}>
        <Typography variant="h6">
          <Link
            href={t('support.buymeacoffee')}
            rel="nofollow"
            target="about:blank"
          >
            <Trans i18nKey="support.consider" />
          </Link>
        </Typography>
      </Ti4TimelineContent>
    </Ti4TimelineItem>
  )
}

function DraftSummary({ payload, happenedAt, session }) {
  return (
    <>
      <Ti4TimelineItem>
        <Ti4TimelineOppositeContent>
          <Typography color="textSecondary">
            {new Date(happenedAt).toLocaleString()}
          </Typography>
        </Ti4TimelineOppositeContent>
        <TimelineSeparator>
          <Ti4TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <Ti4TimelineContent>
          <Typography variant="h5">
            <Trans i18nKey="sessionTimeline.draftSummary.title" />
          </Typography>
          <DraftSummaryTable
            map={session.map}
            mapLink={session.mapLink}
            picks={payload.picks}
            speaker={payload.speaker}
            withTablePositions={Boolean(session.setup.options?.tablePick)}
          />
        </Ti4TimelineContent>
      </Ti4TimelineItem>
      <SupportCreatorEvent />
    </>
  )
}

function SessionSummary({ eventType, payload, happenedAt, session }) {
  const { t } = useTranslation()
  const classes = useStyles()

  const { results } = payload
  results.sort((a, b) => b.points - a.points)

  return (
    <>
      <SupportCreatorEvent />
      <Ti4TimelineItem>
        <Ti4TimelineOppositeContent>
          <Typography color="textSecondary">
            {new Date(happenedAt).toLocaleString()}
          </Typography>
        </Ti4TimelineOppositeContent>
        <TimelineSeparator>
          <Ti4TimelineDot
            color="primary"
            title={t(`sessionTimeline.events.${eventType}`)}
          >
            <SessionSummaryIcon />
          </Ti4TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <Ti4TimelineContent>
          <Typography variant="h5">
            <Trans i18nKey="sessionTimeline.sessionSummary.title" />
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon className={classes.resultListIcon}>
                <PlayerFlag
                  disabled
                  factionKey={payload.winner}
                  height="3em"
                  selected
                  width="4.5em"
                />
              </ListItemIcon>
              <ListItemText
                primary={t('vpCount', { points: session.vpCount })}
                secondary={t('sessionTimeline.sessionSummary.winner')}
              />
            </ListItem>
          </List>
          <List>
            {results.slice(1).map((result) => (
              <ListItem key={result.faction}>
                <ListItemIcon className={classes.resultListIcon}>
                  <PlayerFlag
                    disabled
                    factionKey={result.faction}
                    height="3em"
                    selected
                    width="4.5em"
                  />
                </ListItemIcon>
                <ListItemText
                  primary={t('vpCount', { points: result.points })}
                />
              </ListItem>
            ))}
          </List>
        </Ti4TimelineContent>
      </Ti4TimelineItem>
      <Ti4TimelineItem>
        <Ti4TimelineOppositeContent />
        <TimelineSeparator className={classes.paxMagnifica}>
          <Trans i18nKey="general.paxmagnifica" />
        </TimelineSeparator>
        <Ti4TimelineContent />
      </Ti4TimelineItem>
    </>
  )
}

function SpeakerSelected({ payload, happenedAt }) {
  return (
    <Ti4TimelineItem>
      <Ti4TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </Ti4TimelineOppositeContent>
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

function EventOnATimeline({
  eventType,
  payload,
  happenedAt,
  session,
  fromPoints,
}) {
  const props = { eventType, payload, happenedAt, fromPoints }
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
      return <Picked {...props} mapPositions={session.mapPositions} />
    case 'SpeakerSelected':
      return <SpeakerSelected {...props} />
    case 'DraftSummary':
      return <DraftSummary {...props} session={session} />
    case 'SessionSummary':
      return <SessionSummary {...props} session={session} />
    case 'AgendaVotedOn':
      return <AgendaVotedOn {...props} />
    case 'LawRemoved':
      return <LawRemoved {...props} />
    case 'RelicDrawn':
      return <RelicEvent {...props} />
    case 'RelicUsed':
      return <RelicEvent {...props} />
    default:
      return <DebugEvent {...props} />
  }
}

export function Timeline({ editable, session, sessionService }) {
  const { timeline } = useTimelineEvents({ sessionId: session.id })
  // TODO make it a react-query mutation
  const invalidateQueries = useInvalidateQueries()
  const uploadEvent = useCallback(
    async (payload) => {
      const result = await sessionService.addTimelineEvent(payload, session.id)
      if (result.ok) {
        invalidateQueries(queryKeys.timeline(session.id))
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
            <Ti4TimelineOppositeContent />
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
