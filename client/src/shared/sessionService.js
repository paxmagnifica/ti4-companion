import CONFIG from '../config'

import { handleErrors } from './errorHandling'

const factory = ({ fetch, checksum }) => {
  const pushEvent = (sessionId, gameEvent) =>
    fetch(`${CONFIG.apiUrl}/api/sessions/${sessionId}/events`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        checksum,
        eventType: gameEvent.type,
        serializedPayload: JSON.stringify(gameEvent.payload),
      }),
    }).then(handleErrors)

  return {
    createSession: (payload) =>
      fetch(`${CONFIG.apiUrl}/api/sessions`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(handleErrors)
        .then((r) => r.json()),

    get: (id) =>
      fetch(`${CONFIG.apiUrl}/api/sessions/${id}`).then((response) =>
        response.json(),
      ),

    pushEvent,
    addTimelineEvent: ({ file: imageFile, title, description }, sessionId) => {
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('title', title)
      formData.append('description', description)

      return fetch(`${CONFIG.apiUrl}/api/sessions/${sessionId}/timeline`, {
        method: 'POST',
        body: formData,
      }).then(handleErrors)
    },
    uploadMap: (mapFile, sessionId) => {
      const formData = new FormData()
      formData.append('map', mapFile)

      return fetch(`${CONFIG.apiUrl}/api/sessions/${sessionId}/map`, {
        method: 'POST',
        body: formData,
      }).then(handleErrors)
    },
    setMapLink: (mapLink, sessionId) =>
      fetch(`${CONFIG.apiUrl}/api/sessions/${sessionId}/mapLink`, {
        method: 'POST',
        body: JSON.stringify({ mapLink }),
      }).then(handleErrors),

    getTimeline: async (sessionId) =>
      (
        await fetch(`${CONFIG.apiUrl}/api/sessions/${sessionId}/timeline`).then(
          handleErrors,
        )
      ).json(),
  }
}

export default factory
