import Objective from './Objective'
import FactionSelector from './FactionSelector'

function ObjectiveWithFactionSelector({
  small,
  objective,
  selector,
}) {
  return <>
    <Objective
      small={small}
      {...objective}
    />
    <FactionSelector
      small={small}
      {...selector}
    />
  </>
}

export default ObjectiveWithFactionSelector
