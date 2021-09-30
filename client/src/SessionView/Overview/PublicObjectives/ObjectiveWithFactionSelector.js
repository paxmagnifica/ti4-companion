import Objective from '../../../shared/Objective'

import FactionSelector from './FactionSelector'

function ObjectiveWithFactionSelector({
  size,
  objective,
  selector,
}) {
  return <>
    <FactionSelector
      size={size}
      {...selector}
    />
    <Objective
      size={size}
      {...objective}
    />
  </>
}

export default ObjectiveWithFactionSelector
