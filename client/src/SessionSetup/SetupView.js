import { useState } from 'react'
import { useDispatch } from '../state'
import { Tab, Tabs } from '../components/navigation'

const VIEW = {
  simpleSetup: 'simpleSetup',
  setupDraft: 'setupDraft',
}

export function SetupView() {
  const [view, setView] = useState(VIEW.simpleSetup)
  const dispatch = useDispatch()

  return (
    <Tabs>
      <Tabs value={view}>
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
    </Tabs>
  )
}
