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
import { Trans, useTranslation } from 'react-i18next'

import Objective from '../../shared/Objective'

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

function GameStarted({ payload, happenedAt, eventType }) {
  return (
    <Ti4TimelineItem>
      <TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <Ti4TimelineContent>
        <Typography variant="h5">
          <Trans i18nKey={`sessionTimeline.events.${eventType}`} />
        </Typography>
        <pre>{JSON.stringify(payload, null, 2)}</pre>
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
        <TimelineDot />
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

function ObjectiveAdded({ payload, happenedAt, eventType }) {
  return (
    <Ti4TimelineItem>
      <TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <Ti4TimelineContent>
        <Typography variant="h5">
          <Trans i18nKey={`sessionTimeline.events.${eventType}`} />
        </Typography>
        <Box style={{ display: 'inline-block' }}>
          <Objective slug={payload.slug} />
        </Box>
      </Ti4TimelineContent>
    </Ti4TimelineItem>
  )
}

function ObjectiveScored({ payload, happenedAt, eventType }) {
  const { t } = useTranslation()

  return (
    <Ti4TimelineItem>
      <TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <Ti4TimelineContent>
        <Typography variant="h5">
          <Trans
            i18nKey={`sessionTimeline.events.${eventType}`}
            values={{ faction: t(`factions.${payload.faction}.name`) }}
          />
        </Typography>
        <Box>
          <Typography variant="subitle1">
            <Trans
              i18nKey="sessionTimeline.upTo"
              values={{ points: payload.points }}
            />
          </Typography>
        </Box>
        <Box style={{ display: 'inline-block' }}>
          <Objective slug={payload.slug} />
        </Box>
      </Ti4TimelineContent>
    </Ti4TimelineItem>
  )
}

function VictoryPointsUpdated({ payload, happenedAt, eventType }) {
  const { t } = useTranslation()

  return (
    <Ti4TimelineItem>
      <TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(happenedAt).toLocaleString()}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <Ti4TimelineContent>
        <Typography variant="h5">
          <Trans
            i18nKey={`sessionTimeline.events.${eventType}`}
            values={{ faction: t(`factions.${payload.faction}.name`) }}
          />
        </Typography>
        <Typography variant="subtitle1">
          <Trans
            i18nKey="sessionTimeline.vpScored"
            values={{
              faction: t(`factions.${payload.faction}.name`),
              points: payload.points,
            }}
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
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <Ti4TimelineContent>
            <Typography variant="h5">{eventType}</Typography>
            <Typography variant="subtitle1">
              <pre>{JSON.stringify(payload, null, 2)}</pre>
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
