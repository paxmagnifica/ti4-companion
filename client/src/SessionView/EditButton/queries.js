import { useMutation } from 'react-query'

import CONFIG from '../../config'

const sendPasswordForSecret = ({ sessionId, password }) =>
  fetch(`${CONFIG.apiUrl}/api/sessions/${sessionId}/edit`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  }).then((response) => response.json())
export const usePassword = () => useMutation(sendPasswordForSecret)
