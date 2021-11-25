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
import { withStyles } from '@material-ui/core/styles'
import { Trans } from 'react-i18next'

import Objective from '../../shared/Objective'
import FactionFlag from '../../shared/FactionFlag'
import useSmallViewport from '../../shared/useSmallViewport'

import { useTimelineEvents } from './queries'

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

function GameStarted({ payload, happenedAt, eventType }) {
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
          <Trans i18nKey={`sessionTimeline.events.${eventType}`} />
        </Typography>
        {payload.map((faction) => (
          <Box style={{ display: 'inline-block' }}>
            <FactionFlag
              key={faction}
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

function ObjectiveAdded({ payload, happenedAt }) {
  const small = useSmallViewport()

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
        <Box style={{ display: 'inline-block' }}>
          <Objective slug={payload.slug} small={small} />
        </Box>
      </Ti4TimelineContent>
    </Ti4TimelineItem>
  )
}

function ObjectiveScored({ payload, happenedAt, eventType }) {
  const small = useSmallViewport()

  return (
    <Ti4TimelineItem>
      <TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <Box style={{ margin: '3px 0' }}>
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

function VictoryPointsUpdated({ payload, happenedAt }) {
  return (
    <Ti4TimelineItem>
      <TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <Box style={{ margin: '3px 0' }}>
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

export function Timeline({ session, sessionService }) {
  const { timeline } = useTimelineEvents({
    sessionId: session.id,
    sessionService,
  })

  return (
    <MuiTimeline>
      {timeline.map((event) => (
        <EventOnATimeline {...event} key={event.order} />
      ))}
    </MuiTimeline>
  )
}