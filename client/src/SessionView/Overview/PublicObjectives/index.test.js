import {render, fireEvent} from '@testing-library/react'

import {StateContext, ComboDispatchContext} from '../../../state'

import PublicObjectives from './index'

const state = {
  objectives: {
    data: {
      'diversify-research': {
        secret: false,
        points: 1,
      },
      'achieve-supremacy': {
        secret: false,
        points: 2,
      },
    },
  },
}

test('should add one point to faction when stage one objective is scored', async () => {
  // given
  const dispatch = () => null
  const updateFactionPoints = jest.fn()
  const session = { "objectives":[{ "slug":"diversify-research","scoredBy":[] }],"factions":["The_Embers_of_Muaat","The_Naalu_Collective","The_Universities_of_Jol__Nar","The_Nomad"],"points":[{ "faction":"The_Embers_of_Muaat","points":0 },{ "faction":"The_Naalu_Collective","points":0 },{ "faction":"The_Universities_of_Jol__Nar","points":0 },{ "faction":"The_Nomad","points":0 }],"id":"6fd5c725-30cd-4320-8889-c2f6427ba365","events":null,"createdAt":"0001-01-01T00:00:00+00:00","remote":true }
  }

  const {getByTitle} = render(
    <ComboDispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        <PublicObjectives
          editable
          session={session}
          updateFactionPoints={updateFactionPoints}
        />
      </StateContext.Provider>
    </ComboDispatchContext.Provider>,
  )

  // when
  fireEvent.click(getByTitle('The Universities of Jol-Nar'))

  // then
  expect(updateFactionPoints).toHaveBeenCalledWith({
    points: 1,
    sessionId: session.id,
    faction: 'The_Universities_of_Jol__Nar',
  })
})

test('should add two points to faction when second stage objective is scored', async () => {
  // given
  const dispatch = () => null
  const updateFactionPoints = jest.fn()
  const session = { "objectives":[{ "slug":"achieve-supremacy","scoredBy":[] }],"factions":["The_Embers_of_Muaat","The_Naalu_Collective","The_Universities_of_Jol__Nar","The_Nomad"],"points":[{ "faction":"The_Embers_of_Muaat","points":0 },{ "faction":"The_Naalu_Collective","points":0 },{ "faction":"The_Universities_of_Jol__Nar","points":0 },{ "faction":"The_Nomad","points":0 }],"id":"6fd5c725-30cd-4320-8889-c2f6427ba365","events":null,"createdAt":"0001-01-01T00:00:00+00:00","remote":true }

  const {getByTitle} = render(
    <ComboDispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        <PublicObjectives
          editable
          session={session}
          updateFactionPoints={updateFactionPoints}
        />
      </StateContext.Provider>
    </ComboDispatchContext.Provider>,
  )

  // when
  fireEvent.click(getByTitle('The Universities of Jol-Nar'))

  // then
  expect(updateFactionPoints).toHaveBeenCalledWith({
    points: 2,
    sessionId: session.id,
    faction: 'The_Universities_of_Jol__Nar',
  })
})
