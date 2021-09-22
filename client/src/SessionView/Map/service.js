import CONFIG from '../../config'

export const uploadMap = (mapFile, sessionId) => {
  const formData = new FormData()
  formData.append('map', mapFile)

  return fetch(`${CONFIG.apiUrl}/api/sessions/${sessionId}/map`, {
    method: 'POST',
    body: formData,
  })

  // TODO check status code
}
