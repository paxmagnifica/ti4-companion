import { render } from '@testing-library/react'

import { StateContext } from '../state'

import Objective from './Objective'

const state = {
  objectives: {
    data: {
      'status-phase-objective': {
        secret: true,
        points: 1,
        when: 0,
      },
      'action-phase-objective': {
        secret: true,
        points: 1,
        when: 1,
      },
      'agenda-phase-objective': {
        secret: true,
        points: 1,
        when: 2,
      },
    },
  },
}

test('should display status phase on secret objective', async () => {
  // when
  const { getByText } = render(
    <StateContext.Provider value={state}>
      <Objective slug="status-phase-objective" />
    </StateContext.Provider>,
  )

  // then
  expect(getByText(/status phase/)).toBeDefined()
})

test('should display action phase on secret objective', async () => {
  // when
  const { getByText } = render(
    <StateContext.Provider value={state}>
      <Objective slug="action-phase-objective" />
    </StateContext.Provider>,
  )

  // then
  expect(getByText(/action phase/)).toBeDefined()
})

test('should display agenda phase on secret objective', async () => {
  // when
  const { getByText } = render(
    <StateContext.Provider value={state}>
      <Objective slug="agenda-phase-objective" />
    </StateContext.Provider>,
  )

  // then
  expect(getByText(/agenda phase/)).toBeDefined()
})
