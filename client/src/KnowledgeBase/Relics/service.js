import CONFIG from '../../config'

export const getAll = async () => {
  const result = await fetch(`${CONFIG.apiUrl}/api/relics`)

  // TODO check status code

  return result.json()
}
