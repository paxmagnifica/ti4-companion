export function getMapPositionName({ mapPositions, position, suffix }) {
  const defaultNameSuffix = suffix ? ` ${suffix ?? 'on map'}` : ''

  const positionName = mapPositions?.length
    ? mapPositions[Number(position)].name
    : `P${Number(position) + 1}${defaultNameSuffix}`

  return positionName
}

export function getMapPositionColor({ mapPositions, position }) {
  const color = mapPositions?.length
    ? mapPositions[Number(position)].color ?? null
    : null

  return color
}
