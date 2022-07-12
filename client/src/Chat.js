import { useState, useEffect, useCallback } from 'react'

import { useTranslation } from './i18n'
import config from './config'

const BASE_URL = 'https://app.chatwoot.com'

const hideChatwoot = () => {
  const bubbleContainer = document.querySelector('.woot--bubble-holder')
  if (bubbleContainer) {
    bubbleContainer.style.visibility = 'hidden'
    bubbleContainer.style.pointerEvents = 'none'
  }

  const chatContainer = document.querySelector('.woot-widget-holder')
  if (chatContainer) {
    chatContainer.style.visibility = 'hidden'
    chatContainer.style.pointerEvents = 'none'
  }
}
const showChatwoot = () => {
  const bubbleContainer = document.querySelector('.woot--bubble-holder')
  if (bubbleContainer) {
    bubbleContainer.style.visibility = 'visible'
    bubbleContainer.style.pointerEvents = 'auto'
  }

  const chatContainer = document.querySelector('.woot-widget-holder')
  if (chatContainer) {
    chatContainer.style.visibility = 'visible'
    chatContainer.style.pointerEvents = 'auto'
  }
}

export function useChat() {
  const [isChatwootReady, setIsChatwootReady] = useState(false)
  const { i18n } = useTranslation()

  useEffect(() => {
    if (config.isDevelopment) {
      return
    }

    const setIsReady = () => setIsChatwootReady(true)
    window.addEventListener('chatwoot:ready', setIsReady)

    // eslint-disable-next-line consistent-return
    return () => window.removeEventListener('chatwoot:ready', setIsReady)
  }, [])

  useEffect(() => {
    if (isChatwootReady || config.isDevelopment) {
      return
    }

    window.chatwootSettings = {
      position: 'left',
      language: i18n.language,
    }

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.defer = true
    script.id = 'hs-script-loader'
    script.src = `${BASE_URL}/packs/js/sdk.js`
    script.onload = () => {
      window.chatwootSDK.run({
        websiteToken: config.chatwootToken,
        baseUrl: BASE_URL,
      })
    }

    document.body.appendChild(script)

    // eslint-disable-next-line consistent-return
    return () => {
      document.body.removeChild(script)
    }
  }, [isChatwootReady, i18n.language])

  useEffect(() => {
    if (config.isDevelopment || !isChatwootReady) {
      return
    }

    window.$chatwoot.setLocale(i18n.language)
  }, [isChatwootReady, i18n.language])

  const setChatVisible = useCallback(
    (visible) => (visible ? showChatwoot() : hideChatwoot()),
    [],
  )

  return { setChatVisible }
}
