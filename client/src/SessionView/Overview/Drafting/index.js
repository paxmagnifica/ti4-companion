import { Drafting as RegularDrafting } from './Drafting'
import { KatowiceDrafting } from './KatowiceDrafting'

export function Drafting(props) {
  const { session } = props

  if (session.setup.setupType === 'katowice_draft') {
    return <KatowiceDrafting {...props} />
  }

  return <RegularDrafting {...props} />
}
