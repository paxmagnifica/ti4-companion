import Objective from './Objective'

import { renderWithProviders, getTestQueryClient } from '../testUtils'

test('should display status phase on secret objective', async () => {
  // when
  const { findByText } = renderWithProviders(
    getTestQueryClient(),
    <Objective slug="status-phase-objective" />,
  )

  // then
  expect(findByText(/status phase/)).toBeDefined()
})

test('should display action phase on secret objective', async () => {
  // when
  const { findByText } = renderWithProviders(
    getTestQueryClient(),
    <Objective slug="action-phase-objective" />,
  )

  // then
  expect(findByText(/action phase/)).toBeDefined()
})

test('should display agenda phase on secret objective', async () => {
  // when
  const { findByText } = renderWithProviders(
    getTestQueryClient(),
    <Objective slug="agenda-phase-objective" />,
  )

  // then
  expect(findByText(/agenda phase/)).toBeDefined()
})
