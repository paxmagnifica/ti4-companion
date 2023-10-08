import { useState, useCallback, useMemo } from 'react'
import { Box, Button, Drawer } from '@material-ui/core'
import { Details as DetailsIcon } from '@material-ui/icons'

import { Trans } from '../../../i18n'
import { useTimelineEvents, ORDER } from '../../queries'
import { VP_SOURCE } from '../../../shared/constants'
import PlayerFlag from '../../PlayerFlag'

import { PointsHistory } from './PointsHistory'
import { useMutation, useQueryClient } from 'react-query'

const pointsHistoryEvents = ['VictoryPointsUpdated', 'ObjectiveScored']

export function PointsSourceHelper({
  editable,
  sessionId,
  factions,
  setChatVisibility,
  sessionService,
}) {
  const [selectedFactionFilter, setSelectedFactionFilter] = useState(null)
  const [open, setOpen] = useState(false)
  const closeDrawer = useCallback(() => {
    setOpen(false)
    setChatVisibility(true)
    setSelectedFactionFilter(null)
  }, [setChatVisibility])
  const openDrawer = useCallback(() => {
    setOpen(true)
    setChatVisibility(false)
  }, [setChatVisibility])
  const [visibilityState, setVisibilityState] = useState({})
  const toggleVisibility = (happenedAt, visible) =>
    setVisibilityState((s) => ({ ...s, [happenedAt]: visible }))

  const { timeline } = useTimelineEvents({
    sessionId,
    order: ORDER.DESC,
  })
  const pointsHistory = useMemo(
    () =>
      timeline
        .filter(({ eventType }) => pointsHistoryEvents.includes(eventType))
        .map(({ happenedAt, payload, fromPoints, eventType }) => ({
          happenedAt,
          fromPoints,
          context: payload.slug, // public objectives have slug instead of context
          ...payload,
          source:
            VP_SOURCE.fromBackendToFrontend(payload.source) ||
            (eventType === 'ObjectiveScored' && VP_SOURCE.objective),
          isPublic: eventType === 'ObjectiveScored',
        }))
        .filter(
          ({ faction }) =>
            !faction ||
            !selectedFactionFilter ||
            faction === selectedFactionFilter,
        ),
    [timeline, selectedFactionFilter],
  )
  const { mutate: addSource } = useAddPointSourceMutation({
    sessionId,
    sessionService,
  })

  return (
    <>
      <Button
        endIcon={<DetailsIcon />}
        onClick={openDrawer}
        startIcon={<DetailsIcon />}
      >
        <Trans i18nKey="sessionView.overview.vpSource" />
      </Button>
      <Drawer
        anchor="left"
        onClose={closeDrawer}
        open={open}
        style={{
          maxWidth: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {!selectedFactionFilter && !pointsHistory.length && (
          <p style={{ margin: '1em' }}>
            <Trans i18nKey="sessionView.pointsHistory.empty" />
          </p>
        )}
        {selectedFactionFilter && !pointsHistory.length && (
          <p style={{ margin: '1em' }}>
            <Trans i18nKey="sessionView.pointsHistory.emptyWithFilter" />
          </p>
        )}
        <PointsHistory
          addSource={addSource}
          editable={editable}
          factions={factions}
          pointsHistory={pointsHistory}
          toggleVisibility={toggleVisibility}
          visibilityState={visibilityState}
        />
        <Box
          style={{
            padding: '1em',
            display: 'flex',
            gridColumnGap: '0.3em',
            gridRowGap: '0.3em',
            flexWrap: 'wrap',
          }}
        >
          {factions.map((factionKey) => (
            <PlayerFlag
              key={factionKey}
              factionKey={factionKey}
              height="2em"
              onClick={() =>
                setSelectedFactionFilter((s) =>
                  s === factionKey ? null : factionKey,
                )
              }
              selected={selectedFactionFilter === factionKey}
              width="2.5em"
            />
          ))}
        </Box>
        <Button
          onClick={closeDrawer}
          style={{
            maxWidth: '100%',
          }}
          variant="contained"
        >
          Close
        </Button>
      </Drawer>
    </>
  )
}

function useAddPointSourceMutation({ sessionId, sessionService }) {
  const queryClient = useQueryClient()

  return useMutation(
    ({ faction, points, source, context }) =>
      sessionService.pushEvent(sessionId, {
        type: 'AddPointSource',
        payload: {
          faction,
          points,
          source: VP_SOURCE.fromFrontendToBackend(source),
          context,
        },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeys.timeline(sessionId))
      },
    },
  )
}
