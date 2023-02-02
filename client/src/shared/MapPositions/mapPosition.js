export function getMapPositionName({ draft, position, suffix }) {
  const defaultNameSuffix = suffix ? ` ${suffix ?? 'on map'}` : ''

  const positionName = draft?.mapPositions?.length
    ? draft.mapPositions[Number(position)].name
    : `P${Number(position) + 1}${defaultNameSuffix}`

  return positionName
}

export function getMapPositionColor({ draft, position }) {
  const color = draft?.mapPositions?.length
    ? draft.mapPositions[Number(position)].color ?? null
    : null

  return color
}
