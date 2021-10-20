import Objective from '../../../shared/Objective'

import FactionSelector from './FactionSelector'

function ObjectiveWithFactionSelector({
  disabled,
  size,
  objective,
  selector,
  session,
  deletable,
}) {
  return (
    <>
      <FactionSelector disabled={disabled} size={size} {...selector} />
      <Objective
        deletable={deletable}
        session={session}
        size={size}
        {...objective}
      />
    </>
  )
}

export default ObjectiveWithFactionSelector
