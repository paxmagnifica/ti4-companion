import { useState, useCallback } from 'react'
import { Container } from '@material-ui/core'

import { useDispatch } from '../state'
import { Tab, Tabs } from '../components/navigation'

import { NewSession } from './NewSession'

const VIEW = {
  simpleSetup: 'simpleSetup',
  setupDraft: 'setupDraft',
}

export function SessionSetup() {
  const [view, setView] = useState(VIEW.simpleSetup)
  const dispatch = useDispatch()

  const handleViewChange = useCallback((_event, newView) => {
    setView(newView)
  }, [])

  const renderView = useCallback(() => {
    switch (view) {
      case VIEW.simpleSetup:
        return <NewSession dispatch={dispatch} />
      case VIEW.setupDraft:
        return <p>coming soon</p>
      default:
        return null
    }
  }, [view, dispatch])

  return (
    <>
      <Tabs onChange={handleViewChange} value={view}>
        <Tab
          label="The factions are already decided"
          title="The factions are already decided"
          value={VIEW.simpleSetup}
        />
        <Tab
          label="We want to draft"
          title="We want to draft"
          value={VIEW.setupDraft}
        />
      </Tabs>
      <Container style={{ marginTop: '4em' }}>{renderView()}</Container>
    </>
  )
}
