import { useEffect, useCallback } from 'react'
import { Typography, Box } from '@material-ui/core'
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
} from '@material-ui/icons'

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
    marginLeft: '2.1em',
    marginRight: '2.1em',
  },
})(TimelineDot)

const useStyles = makeStyles({
  dotWithIcon: {
    marginLeft: 0,
    marginRight: 0,
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
})

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
        {payload.map((faction) => (
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
        <Ti4TimelineDot title={t(`sessionTimeline.events.${eventType}`)} />
        <TimelineConnector />
      </TimelineSeparator>
      <Ti4TimelineContent>
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

function ImageFromPayload({ eventType, Icon, payload, happenedAt }) {
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
          className={classes.dotWithIcon}
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

function EventOnATimeline({ eventType, payload, happenedAt }) {
  switch (eventType) {
    case 'GameStarted':
      return (
        <GameStarted
          eventType={eventType}
          happenedAt={happenedAt}
          payload={payload}
        />
      )
    case 'VpCountChanged':
      return (
        <VpCountChanged
          eventType={eventType}
          happenedAt={happenedAt}
          payload={payload}
        />
      )
    case 'ObjectiveAdded':
      return (
        <ObjectiveAdded
          eventType={eventType}
          happenedAt={happenedAt}
          payload={payload}
        />
      )
    case 'VictoryPointsUpdated':
      return (
        <VictoryPointsUpdated
          eventType={eventType}
          happenedAt={happenedAt}
          payload={payload}
        />
      )
    case 'ObjectiveScored':
      return (
        <ObjectiveScored
          eventType={eventType}
          happenedAt={happenedAt}
          payload={payload}
        />
      )
    case 'MapAdded':
      return (
        <ImageFromPayload
          eventType={eventType}
          happenedAt={happenedAt}
          Icon={<MapIcon />}
          payload={payload}
        />
      )
    case 'TimelineUserEvent':
      return (
        <ImageFromPayload
          eventType={eventType}
          happenedAt={happenedAt}
          Icon={<UserEventIcon />}
          payload={payload}
        />
      )
    default:
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
            <Typography title={eventType} variant="h5">
              {eventType}
            </Typography>
          </Ti4TimelineContent>
        </Ti4TimelineItem>
      )
  }
}

export function Timeline({ editable, session, sessionService }) {
  const { timeline } = useTimelineEvents({
    sessionId: session.id,
    sessionService,
  })
  const invalidateQueries = useInvalidateQueries()

  const uploadEvent = useCallback(
    async (file) => {
      const result = await sessionService.addTimelineEvent(file, session.id)
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
        {timeline.map((event) => (
          <EventOnATimeline {...event} key={event.order} />
        ))}
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
