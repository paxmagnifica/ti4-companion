import { fireEvent } from '@testing-library/react'

import { ComboDispatchContext } from '../../../../state'
import { renderWithProviders, getTestQueryClient } from '../../../../testUtils'

import PublicObjectives from './index'

const sessionId = '6fd5c725-30cd-4320-8889-c2f6427ba365'

let mockSessionObject = null

jest.mock('../../../useSessionContext', () => ({
  useSessionContext: () => ({
    session: mockSessionObject,
  }),
}))

test('should add first point to faction when stage one objective is scored', async () => {
  // given
  const dispatch = jest.fn()
  const factions = [
    'The_Embers_of_Muaat',
    'The_Naalu_Collective',
    'The_Universities_of_Jol__Nar',
    'The_Nomad',
  ]

  mockSessionObject = {
    objectives: [{ slug: 'diversify-research', scoredBy: [] }],
    factions,
    players: factions.map((faction, idx) => ({
      playerName: `Player ${idx}`,
      faction,
    })),
    points: [
      { faction: 'The_Embers_of_Muaat', points: 0 },
      { faction: 'The_Naalu_Collective', points: 0 },
      { faction: 'The_Universities_of_Jol__Nar', points: 0 },
      { faction: 'The_Nomad', points: 0 },
    ],
    id: sessionId,
    events: null,
    createdAt: '0001-01-01T00:00:00+00:00',
    remote: true,
  }

  const { findByTitle } = renderWithProviders(
    getTestQueryClient(),
    <ComboDispatchContext.Provider value={dispatch}>
      <PublicObjectives editable session={mockSessionObject} />
    </ComboDispatchContext.Provider>,
  )

  // when
  fireEvent.click(await findByTitle('The Universities of Jol-Nar (Player 2)'))

  // then
  expect(dispatch).toHaveBeenCalledWith({
    type: 'ObjectiveScored',
    payload: {
      sessionId,
      points: 1,
      faction: 'The_Universities_of_Jol__Nar',
      slug: 'diversify-research',
    },
  })
})

test('should add one point to faction points when stage one objective is scored', async () => {
  // given
  const dispatch = jest.fn()
  const factions = [
    'The_Embers_of_Muaat',
    'The_Naalu_Collective',
    'The_Universities_of_Jol__Nar',
    'The_Nomad',
  ]

  mockSessionObject = {
    objectives: [{ slug: 'diversify-research', scoredBy: [] }],
    factions,
    players: factions.map((faction, idx) => ({
      playerName: `Player ${idx}`,
      faction,
    })),
    points: [
      { faction: 'The_Embers_of_Muaat', points: 0 },
      { faction: 'The_Naalu_Collective', points: 0 },
      { faction: 'The_Universities_of_Jol__Nar', points: 2 },
      { faction: 'The_Nomad', points: 0 },
    ],
    id: sessionId,
    events: null,
    createdAt: '0001-01-01T00:00:00+00:00',
    remote: true,
  }

  const { findByTitle } = renderWithProviders(
    getTestQueryClient(),
    <ComboDispatchContext.Provider value={dispatch}>
      <PublicObjectives editable session={mockSessionObject} />
    </ComboDispatchContext.Provider>,
  )

  // when
  fireEvent.click(await findByTitle('The Universities of Jol-Nar (Player 2)'))

  // then
  expect(dispatch).toHaveBeenCalledWith({
    type: 'ObjectiveScored',
    payload: {
      sessionId,
      points: 3,
      faction: 'The_Universities_of_Jol__Nar',
      slug: 'diversify-research',
    },
  })
})

test('should add two points to faction with 0 points when second stage objective is scored', async () => {
  // given
  const dispatch = jest.fn()
  const factions = [
    'The_Embers_of_Muaat',
    'The_Naalu_Collective',
    'The_Universities_of_Jol__Nar',
    'The_Nomad',
  ]

  mockSessionObject = {
    objectives: [{ slug: 'achieve-supremacy', scoredBy: [] }],
    factions,
    players: factions.map((faction, idx) => ({
      playerName: `Player ${idx}`,
      faction,
    })),
    points: [
      { faction: 'The_Embers_of_Muaat', points: 0 },
      { faction: 'The_Naalu_Collective', points: 0 },
      { faction: 'The_Universities_of_Jol__Nar', points: 0 },
      { faction: 'The_Nomad', points: 0 },
    ],
    id: sessionId,
    events: null,
    createdAt: '0001-01-01T00:00:00+00:00',
    remote: true,
  }

  const { findByTitle } = renderWithProviders(
    getTestQueryClient(),
    <ComboDispatchContext.Provider value={dispatch}>
      <PublicObjectives editable session={mockSessionObject} />
    </ComboDispatchContext.Provider>,
  )

  // when
  fireEvent.click(await findByTitle('The Universities of Jol-Nar (Player 2)'))

  // then
  expect(dispatch).toHaveBeenCalledWith({
    type: 'ObjectiveScored',
    payload: {
      points: 2,
      sessionId,
      faction: 'The_Universities_of_Jol__Nar',
      slug: 'achieve-supremacy',
    },
  })
})

test('should add two points to faction with points when second stage objective is scored', async () => {
  // given
  const dispatch = jest.fn()
  const factions = [
    'The_Embers_of_Muaat',
    'The_Naalu_Collective',
    'The_Universities_of_Jol__Nar',
    'The_Nomad',
  ]

  mockSessionObject = {
    objectives: [{ slug: 'achieve-supremacy', scoredBy: [] }],
    factions,
    players: factions.map((faction, idx) => ({
      playerName: `Player ${idx}`,
      faction,
    })),
    points: [
      { faction: 'The_Embers_of_Muaat', points: 0 },
      { faction: 'The_Naalu_Collective', points: 0 },
      { faction: 'The_Universities_of_Jol__Nar', points: 4 },
      { faction: 'The_Nomad', points: 0 },
    ],
    id: sessionId,
    events: null,
    createdAt: '0001-01-01T00:00:00+00:00',
    remote: true,
  }

  const { findByTitle } = renderWithProviders(
    getTestQueryClient(),
    <ComboDispatchContext.Provider value={dispatch}>
      <PublicObjectives editable session={mockSessionObject} />
    </ComboDispatchContext.Provider>,
  )

  // when
  fireEvent.click(await findByTitle('The Universities of Jol-Nar (Player 2)'))

  // then
  expect(dispatch).toHaveBeenCalledWith({
    type: 'ObjectiveScored',
    payload: {
      points: 6,
      sessionId,
      faction: 'The_Universities_of_Jol__Nar',
      slug: 'achieve-supremacy',
    },
  })
})
