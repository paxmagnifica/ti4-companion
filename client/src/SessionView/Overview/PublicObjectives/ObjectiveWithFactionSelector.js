import Objective from '../../../shared/Objective'

import FactionSelector from './FactionSelector'

function ObjectiveWithFactionSelector({
  disabled,
  size,
  objective,
  selector,
}) {
  return <>
    <FactionSelector
      disabled={disabled}
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
