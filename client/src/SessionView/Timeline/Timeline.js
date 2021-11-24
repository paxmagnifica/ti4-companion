import { Typography } from '@material-ui/core'
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

import { useTimelineEvents } from './queries'

const Ti4TimelineContent = withStyles({
  root: {
    paddingTop: 0,
  },
})(TimelineContent)

const Ti4TimelineItem = withStyles({
  root: {
    minHeight: 100,
  },
})(TimelineItem)

function GameStarted({ payload, happenedAt }) {
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
        <Typography variant="h5">Game started</Typography>
        <pre>{JSON.stringify(payload, null, 2)}</pre>
      </Ti4TimelineContent>
    </Ti4TimelineItem>
  )
}

function VpCountChanged({ payload, happenedAt }) {
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
        <Typography variant="h5">VP count changed</Typography>
        <Typography variant="subtitle1">
          {payload.from} -> {payload.to}
        </Typography>
      </Ti4TimelineContent>
    </Ti4TimelineItem>
  )
}

function EventOnATimeline({ eventType, payload, happenedAt }) {
  switch (eventType) {
    case 'GameStarted':
      return <GameStarted happenedAt={happenedAt} payload={payload} />
    case 'VpCountChanged':
      return <VpCountChanged happenedAt={happenedAt} payload={payload} />
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
    <MuiTimeline align="alternate">
      <TimelineItem>
        <TimelineSeparator>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent />
      </TimelineItem>
      {/* always there unless game ended xD */}
      {timeline.map((event) => (
        <EventOnATimeline {...event} key={event.order} />
      ))}
    </MuiTimeline>
  )
}
