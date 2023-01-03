export function getMapPositionName({ draft, position, suffix }) {
  const defaultNameSuffix = suffix ? ` ${suffix ?? 'on map'}` : ''

  const positionName = draft?.mapPositionNames?.length
    ? draft.mapPositionNames[position]
    : `P${position + 1}${defaultNameSuffix}`

  return positionName
}
