import CONFIG from '../config'

import { saveSession } from './persistence'

const factory = ({ fetch }) => {
  const pushEvent = (sessionId, gameEvent) =>
    fetch(`${CONFIG.apiUrl}/api/sessions/${sessionId}/events`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: gameEvent.type,
        serializedPayload: JSON.stringify(gameEvent.payload),
      }),
    })

  return {
    createSession: async (payload) => {
      const result = await fetch(`${CONFIG.apiUrl}/api/sessions`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const session = await result.json()

      await saveSession(session)

      return session
    },

    ping: () => fetch(`${CONFIG.apiUrl}/api/ping`, { method: 'post' }),

    get: async (id) => {
      const result = await fetch(`${CONFIG.apiUrl}/api/sessions/${id}`)

      // TODO check status code

      return result.json()
    },

    pushEvent,
    addTimelineEvent: ({ file: imageFile, title, description }, sessionId) => {
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('title', title)
      formData.append('description', description)

      return fetch(`${CONFIG.apiUrl}/api/sessions/${sessionId}/timeline`, {
        method: 'POST',
        body: formData,
      })
    },
    uploadMap: (mapFile, sessionId) => {
      const formData = new FormData()
      formData.append('map', mapFile)

      return fetch(`${CONFIG.apiUrl}/api/sessions/${sessionId}/map`, {
        method: 'POST',
        body: formData,
      })
    },

    getTimeline: async (sessionId) =>
      (
        await fetch(`${CONFIG.apiUrl}/api/sessions/${sessionId}/timeline`)
      ).json(),
  }
}

export default factory
