// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
// eslint-disable-next-line
import { rest } from 'msw'
// eslint-disable-next-line
import { setupServer } from 'msw/node'

import CONFIG from './config'
import factory from './i18n'

const server = setupServer(
  ...[
    rest.get(`${CONFIG.apiUrl}/api/objectives`, (req, res, ctx) =>
      res(
        ctx.json([
          {
            slug: 'status-phase-objective',
            secret: true,
            points: 1,
            when: 0,
          },
          {
            slug: 'action-phase-objective',
            secret: true,
            points: 1,
            when: 1,
          },
          {
            slug: 'agenda-phase-objective',
            secret: true,
            points: 1,
            when: 2,
          },
          {
            slug: 'diversify-research',
            secret: false,
            points: 1,
          },
          {
            slug: 'achieve-supremacy',
            secret: false,
            points: 2,
          },
        ]),
      ),
    ),
  ],
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

factory({ debug: false })
