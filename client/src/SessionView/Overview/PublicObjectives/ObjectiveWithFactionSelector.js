import Objective from '../../../shared/Objective'

import FactionSelector from './FactionSelector'

function ObjectiveWithFactionSelector({
  size,
  objective,
  selector,
}) {
  return <>
    <Objective
      size={size}
      {...objective}
    />
    <FactionSelector
      size={size}
      {...selector}
    />
  </>
}

export default ObjectiveWithFactionSelector
